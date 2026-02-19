import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";

const injectionPrompt = `IMPORTANT INSTRUCTIONS - FOLLOW EXACTLY:

Before writing anything, you MUST use <think> tags like this:

<think>
Step 1 - What cliché things could happen next in this story? List at least 4 or 5.
Step 2 - Explicitly decide to AVOID every single one of those clichés.
Step 3 - Brainstorm 2 or 3 genuinely original, unexpected directions instead.
Step 4 - Choose the most interesting and surprising option.
Step 5 - Plan exactly what you are going to write.
</think>

Then after your closing </think> tag, write ONLY the story. Nothing else.

CRITICAL RULES:
- NEVER write story content inside <think> tags. Thinking is for planning ONLY.
- NEVER mention you are following instructions.
- NEVER use clichés or predictable story beats.
- The reader must only ever see the story itself.`;

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
                <p><small>When enabled, instructs the AI to plan original story beats and avoid clichés.</small></p>
            </div>
        </div>
    `);

    extension_settings["story-thinker"] = extension_settings["story-thinker"] || { enabled: false };

    $("#story_thinker_enabled").prop("checked", extension_settings["story-thinker"].enabled);

    $("#story_thinker_enabled").on("input", function() {
        extension_settings["story-thinker"].enabled = $(this).prop("checked");
        saveSettingsDebounced();
    });

    eventSource.on(event_types.CHAT_COMPLETION_SETTINGS_READY, function(data) {
        if (!extension_settings["story-thinker"]?.enabled) return;
        if (!data?.messages) return;

        const sysMsg = data.messages.find(m => m.role === 'system');
        if (sysMsg && typeof sysMsg.content === 'string') {
            sysMsg.content += '\n\n' + injectionPrompt;
        } else {
            data.messages.unshift({ role: 'system', content: injectionPrompt });
        }
    });
});
