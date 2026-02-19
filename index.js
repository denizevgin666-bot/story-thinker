import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

jQuery(async () => {
    $("#extensions_settings2").append(`
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Story Thinker</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div>
                    <input id="story_thinker_enabled" type="checkbox" />
                    <label for="story_thinker_enabled">Enable Story Thinker</label>
                </div>
            </div>
        </div>
    `);

    extension_settings["story-thinker"] = extension_settings["story-thinker"] || { enabled: false };

    $("#story_thinker_enabled").prop("checked", extension_settings["story-thinker"].enabled);

    $("#story_thinker_enabled").on("input", function() {
        extension_settings["story-thinker"].enabled = $(this).prop("checked");
        saveSettingsDebounced();
    });
});
