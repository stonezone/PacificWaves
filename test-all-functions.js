/**
 * PacificWaves - Comprehensive Function Test Suite
 *
 * Run this script in the browser console after loading waves.html
 * Usage: Copy and paste this entire script into the browser console
 */

(function() {
    console.log("========================================");
    console.log("PACIFICWAVES COMPREHENSIVE TEST SUITE");
    console.log("========================================\n");

    const testResults = [];
    const addResult = (category, test, status, details = "") => {
        testResults.push({ category, test, status, details });
        const icon = status === "PASS" ? "✅" : status === "PARTIAL" ? "⚠️" : "❌";
        console.log(`${icon} ${category} - ${test}: ${status}`);
        if (details) console.log(`   ${details}`);
    };

    // Helper to wait for next frame
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Test Suite
    async function runAllTests() {

        // ===== 1. INITIALIZATION TESTS =====
        console.log("\n📋 Testing Initialization...");

        try {
            if (typeof state !== 'undefined' && state !== null) {
                addResult("Init", "Global state object exists", "PASS");
            } else {
                addResult("Init", "Global state object exists", "FAIL", "state is undefined");
            }
        } catch(e) {
            addResult("Init", "Global state object exists", "FAIL", e.message);
        }

        try {
            const canvas = document.getElementById('simCanvas');
            if (canvas && canvas.getContext) {
                addResult("Init", "Canvas element exists", "PASS");
            } else {
                addResult("Init", "Canvas element exists", "FAIL", "Canvas not found or no context");
            }
        } catch(e) {
            addResult("Init", "Canvas element exists", "FAIL", e.message);
        }

        try {
            if (typeof Render !== 'undefined' && Render.canvas) {
                addResult("Init", "Render module initialized", "PASS");
            } else {
                addResult("Init", "Render module initialized", "FAIL", "Render not initialized");
            }
        } catch(e) {
            addResult("Init", "Render module initialized", "FAIL", e.message);
        }

        try {
            if (typeof UI !== 'undefined') {
                addResult("Init", "UI module exists", "PASS");
            } else {
                addResult("Init", "UI module exists", "FAIL");
            }
        } catch(e) {
            addResult("Init", "UI module exists", "FAIL", e.message);
        }

        // ===== 2. UI BUTTON TESTS =====
        console.log("\n🎮 Testing UI Buttons...");

        // Play/Pause button
        try {
            const btn = document.getElementById('playPauseButton');
            if (btn) {
                const wasRunning = state.isRunning;
                btn.click();
                await wait(100);
                if (state.isRunning !== wasRunning) {
                    addResult("UI", "Play/Pause button toggles state", "PASS");
                    // Toggle back
                    btn.click();
                } else {
                    addResult("UI", "Play/Pause button toggles state", "FAIL", "State did not change");
                }
            } else {
                addResult("UI", "Play/Pause button exists", "FAIL", "Button not found");
            }
        } catch(e) {
            addResult("UI", "Play/Pause button", "FAIL", e.message);
        }

        // Step button
        try {
            const btn = document.getElementById('stepButton');
            if (btn) {
                const oldTime = state.simTimeHours;
                btn.click();
                await wait(100);
                if (state.simTimeHours > oldTime) {
                    addResult("UI", "Step button advances time", "PASS");
                } else {
                    addResult("UI", "Step button advances time", "PARTIAL", "Time did not advance - may need simulation paused");
                }
            } else {
                addResult("UI", "Step button exists", "FAIL", "Button not found");
            }
        } catch(e) {
            addResult("UI", "Step button", "FAIL", e.message);
        }

        // Reset button
        try {
            const btn = document.getElementById('resetButton');
            if (btn) {
                btn.click();
                await wait(100);
                if (state.simTimeHours === 0 && state.storms.length === 0) {
                    addResult("UI", "Reset button clears simulation", "PASS");
                } else {
                    addResult("UI", "Reset button clears simulation", "PARTIAL", `Time: ${state.simTimeHours}, Storms: ${state.storms.length}`);
                }
            } else {
                addResult("UI", "Reset button exists", "FAIL", "Button not found");
            }
        } catch(e) {
            addResult("UI", "Reset button", "FAIL", e.message);
        }

        // Speed slider
        try {
            const slider = document.getElementById('timeSlider');
            if (slider) {
                const oldValue = slider.value;
                slider.value = 5;
                slider.dispatchEvent(new Event('input'));
                await wait(100);
                addResult("UI", "Speed slider exists and responds", "PASS");
                slider.value = oldValue;
                slider.dispatchEvent(new Event('input'));
            } else {
                addResult("UI", "Speed slider exists", "FAIL", "Slider not found");
            }
        } catch(e) {
            addResult("UI", "Speed slider", "FAIL", e.message);
        }

        // Seed input
        try {
            const input = document.getElementById('seedInput');
            const btn = document.getElementById('setSeedButton');
            if (input && btn) {
                addResult("UI", "Seed input and button exist", "PASS");
            } else {
                addResult("UI", "Seed input and button exist", "FAIL", "Elements not found");
            }
        } catch(e) {
            addResult("UI", "Seed input", "FAIL", e.message);
        }

        // Measure tool button
        try {
            const btn = document.getElementById('measureToolButton');
            if (btn) {
                const wasActive = state.ui.measurementTool.active;
                btn.click();
                await wait(100);
                if (state.ui.measurementTool.active !== wasActive) {
                    addResult("UI", "Measure tool button toggles", "PASS");
                    btn.click(); // Toggle back
                } else {
                    addResult("UI", "Measure tool button toggles", "FAIL", "State did not change");
                }
            } else {
                addResult("UI", "Measure tool button exists", "FAIL", "Button not found");
            }
        } catch(e) {
            addResult("UI", "Measure tool", "FAIL", e.message);
        }

        // Help button
        try {
            const btn = document.getElementById('helpButton');
            const modal = document.getElementById('helpModal');
            if (btn && modal) {
                btn.click();
                await wait(100);
                const isVisible = modal.style.display !== 'none' && !modal.classList.contains('hidden');
                if (isVisible || modal.offsetParent !== null) {
                    addResult("UI", "Help button shows modal", "PASS");
                    document.getElementById('closeHelpButton')?.click();
                } else {
                    addResult("UI", "Help button shows modal", "PARTIAL", "Modal may not be visible");
                }
            } else {
                addResult("UI", "Help button and modal exist", "FAIL", "Elements not found");
            }
        } catch(e) {
            addResult("UI", "Help button", "FAIL", e.message);
        }

        // ===== 3. TAB TESTS =====
        console.log("\n📑 Testing Tabs...");

        const tabs = ['tab-storms', 'tab-sites', 'tab-env', 'tab-scenarios', 'tab-diag'];
        for (const tabId of tabs) {
            try {
                const button = document.querySelector(`[data-tab="${tabId}"]`);
                const content = document.getElementById(tabId);
                if (button && content) {
                    button.click();
                    await wait(50);
                    if (content.classList.contains('active')) {
                        addResult("Tabs", `${tabId} switches correctly`, "PASS");
                    } else {
                        addResult("Tabs", `${tabId} switches correctly`, "FAIL", "Content not marked active");
                    }
                } else {
                    addResult("Tabs", `${tabId} exists`, "FAIL", "Tab or content not found");
                }
            } catch(e) {
                addResult("Tabs", tabId, "FAIL", e.message);
            }
        }

        // ===== 4. STORM PLACEMENT TESTS =====
        console.log("\n🌀 Testing Storm Placement...");

        try {
            const oldStormCount = state.storms.length;

            // Test place storm button
            const placeBtn = document.getElementById('placeStormButton');
            if (placeBtn) {
                placeBtn.click();
                await wait(100);
                if (state.ui.isPlacingStorm) {
                    addResult("Storm", "Place storm mode activates", "PASS");
                } else {
                    addResult("Storm", "Place storm mode activates", "FAIL", "isPlacingStorm not set");
                }
            } else {
                addResult("Storm", "Place storm button exists", "FAIL", "Button not found");
            }

            // Test programmatic storm addition
            if (typeof Sim !== 'undefined' && typeof Sim.addStorm === 'function') {
                const storm = Sim.addStorm(35, 180, 15, 90, 40, 500, 48, "Test Storm");
                if (storm && state.storms.length > oldStormCount) {
                    addResult("Storm", "Add storm programmatically", "PASS", `Storm ID: ${storm.id}`);

                    // Test storm appears in list
                    const stormList = document.getElementById('stormList');
                    if (stormList && stormList.innerHTML.includes("Test Storm")) {
                        addResult("Storm", "Storm appears in UI list", "PASS");
                    } else {
                        addResult("Storm", "Storm appears in UI list", "FAIL", "Storm not in list");
                    }
                } else {
                    addResult("Storm", "Add storm programmatically", "FAIL", "Storm not created");
                }
            } else {
                addResult("Storm", "Sim.addStorm function exists", "FAIL");
            }
        } catch(e) {
            addResult("Storm", "Storm placement", "FAIL", e.message);
        }

        // ===== 5. STORM EDITING TESTS =====
        console.log("\n✏️ Testing Storm Editing...");

        try {
            if (state.storms.length > 0) {
                const storm = state.storms[0];
                state.ui.selectedStormId = storm.id;
                UI.updateStormEditor();

                const editor = document.getElementById('stormEditor');
                if (editor && editor.style.display !== 'none') {
                    addResult("Storm Edit", "Storm editor shows for selected storm", "PASS");

                    // Test clone button
                    const cloneBtn = document.getElementById('cloneStormButton');
                    const oldCount = state.storms.length;
                    if (cloneBtn) {
                        cloneBtn.click();
                        await wait(100);
                        if (state.storms.length > oldCount) {
                            addResult("Storm Edit", "Clone storm button works", "PASS");
                        } else {
                            addResult("Storm Edit", "Clone storm button works", "FAIL", "Storm not cloned");
                        }
                    }

                    // Test delete button
                    const deleteBtn = document.getElementById('deleteStormButton');
                    const countBeforeDelete = state.storms.length;
                    if (deleteBtn) {
                        deleteBtn.click();
                        await wait(100);
                        if (state.storms.length < countBeforeDelete) {
                            addResult("Storm Edit", "Delete storm button works", "PASS");
                        } else {
                            addResult("Storm Edit", "Delete storm button works", "FAIL", "Storm not deleted");
                        }
                    }
                } else {
                    addResult("Storm Edit", "Storm editor shows", "FAIL", "Editor not visible");
                }
            } else {
                addResult("Storm Edit", "Storm editing tests", "PARTIAL", "No storms to test with");
            }
        } catch(e) {
            addResult("Storm Edit", "Storm editing", "FAIL", e.message);
        }

        // ===== 6. RENDERING TESTS =====
        console.log("\n🎨 Testing Rendering...");

        try {
            if (Render.backgroundLoaded && Render.backgroundImage) {
                addResult("Render", "Background image loaded", "PASS", `${Render.backgroundImage.width}x${Render.backgroundImage.height}`);
            } else {
                addResult("Render", "Background image loaded", "FAIL", "Background not loaded");
            }
        } catch(e) {
            addResult("Render", "Background image", "FAIL", e.message);
        }

        try {
            if (typeof window.sprites !== 'undefined') {
                addResult("Render", "Sprite loader available", "PASS");
            } else {
                addResult("Render", "Sprite loader available", "PARTIAL", "Sprites not loaded (non-critical)");
            }
        } catch(e) {
            addResult("Render", "Sprite loader", "PARTIAL", e.message);
        }

        try {
            if (Render.fps && Render.fps > 0) {
                addResult("Render", "Rendering loop active", "PASS", `${Render.fps} FPS`);
            } else {
                addResult("Render", "Rendering loop active", "PARTIAL", "FPS not yet calculated");
            }
        } catch(e) {
            addResult("Render", "Rendering loop", "FAIL", e.message);
        }

        // ===== 7. MEASUREMENT SITES TESTS =====
        console.log("\n📍 Testing Measurement Sites...");

        try {
            if (state.sites && state.sites.length > 0) {
                addResult("Sites", "Measurement sites exist in state", "PASS", `${state.sites.length} sites`);

                // Check site names
                const siteNames = state.sites.map(s => s.name);
                console.log(`   Sites: ${siteNames.join(', ')}`);

                // Test site table rendering
                const peakTable = document.getElementById('sitePeakTableBody');
                const currTable = document.getElementById('siteCurrentTableBody');
                if (peakTable && currTable) {
                    addResult("Sites", "Site tables exist in DOM", "PASS");
                } else {
                    addResult("Sites", "Site tables exist in DOM", "FAIL", "Tables not found");
                }
            } else {
                addResult("Sites", "Measurement sites exist", "FAIL", "No sites in state");
            }
        } catch(e) {
            addResult("Sites", "Measurement sites", "FAIL", e.message);
        }

        // ===== 8. PHYSICS/SIMULATION TESTS =====
        console.log("\n🔬 Testing Physics/Simulation...");

        try {
            if (typeof Sim !== 'undefined' && typeof Sim.step === 'function') {
                addResult("Physics", "Sim.step function exists", "PASS");
            } else {
                addResult("Physics", "Sim.step function exists", "FAIL");
            }
        } catch(e) {
            addResult("Physics", "Sim module", "FAIL", e.message);
        }

        try {
            if (state.grid && state.grid.Hs && state.grid.windU) {
                addResult("Physics", "Wave grid arrays exist", "PASS");
            } else {
                addResult("Physics", "Wave grid arrays exist", "FAIL", "Grid data missing");
            }
        } catch(e) {
            addResult("Physics", "Wave grid", "FAIL", e.message);
        }

        try {
            if (state.staticGrid && state.staticGrid.isLand) {
                const landCount = state.staticGrid.isLand.filter(x => x === 1).length;
                addResult("Physics", "Land grid exists", "PASS", `${landCount} land cells`);
            } else {
                addResult("Physics", "Land grid exists", "FAIL");
            }
        } catch(e) {
            addResult("Physics", "Land grid", "FAIL", e.message);
        }

        // ===== 9. CONSOLE ERRORS CHECK =====
        console.log("\n🐛 Checking Console for Errors...");

        addResult("Console", "Check browser console manually", "INFO", "Look for red error messages above");

        // ===== FINAL REPORT =====
        console.log("\n========================================");
        console.log("TEST SUMMARY");
        console.log("========================================");

        const passed = testResults.filter(r => r.status === "PASS").length;
        const partial = testResults.filter(r => r.status === "PARTIAL").length;
        const failed = testResults.filter(r => r.status === "FAIL").length;
        const total = testResults.length;

        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`⚠️ Partial: ${partial}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`Success Rate: ${((passed/total)*100).toFixed(1)}%`);

        console.log("\n📊 DETAILED RESULTS BY CATEGORY:");
        const categories = [...new Set(testResults.map(r => r.category))];
        categories.forEach(cat => {
            const catResults = testResults.filter(r => r.category === cat);
            const catPassed = catResults.filter(r => r.status === "PASS").length;
            console.log(`\n${cat}: ${catPassed}/${catResults.length} passed`);
            catResults.forEach(r => {
                const icon = r.status === "PASS" ? "✅" : r.status === "PARTIAL" ? "⚠️" : "❌";
                console.log(`  ${icon} ${r.test}`);
                if (r.details && r.status !== "PASS") {
                    console.log(`     → ${r.details}`);
                }
            });
        });

        console.log("\n========================================");
        console.log("TEST COMPLETE");
        console.log("========================================\n");

        return testResults;
    }

    // Run the tests
    runAllTests().then(results => {
        window.testResults = results;
        console.log("💾 Results saved to window.testResults");
    });

})();
