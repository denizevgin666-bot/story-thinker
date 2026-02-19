import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";

const extensionName = "story-thinker";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

const defaultSettings = {
    enabled: false
};

const injectionPrompt = `IMPORTANT INSTRUCTIONS - FOLLOW EXACTLY:

Before writing anything, you MUST think through your response using <think> tags like this:

<think>
Step 1 - What cliché things could happen next in this story? List at least 4 or 5 of them.
Step 2 - Explicitly decide to AVOID every single one of those clichés.
Step 3 - Brainstorm 2 or 3 genuinely original, unexpected directions the story could go instead.
Step 4 - Choose the most interesting and surprising option.
Step 5 - Plan out what you are actually going to write.
</think>

Then, after your closing </think> tag, write ONLY the story content. Nothing else.

CRITICAL RULES:
- NEVER write story content inside <think> tags. The thinking block is for planning ONLY.
- NEVER mention that you are following instructions or that you are thinking.
- NEVER use clichés or predictable story beats.
- The reader should only ever see the story itself, not your planning.`;

function onChatCompletionReady(data) {
    if (!extension_settings[extensionName]?.enabled) return;

    if (data && data.messages && Array.isArray(data.messages)) {
        const sysMsg = data.messages.find(m => m.role === 'system');
        if (sysMsg) {
            if (typeof sysMsg.content === 'string') {
                sysMsg.content += '\n\n' + injectionPrompt;
            }
        } else {
            data.messages.unshift({ role: 'system', content: injectionPrompt });
        }
    }
}

async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
    $("#story_thinker_enabled").prop("checked", extension_settings[extensionName].enabled);
}

function onEnabledChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].enabled = value;
    saveSettingsDebounced();
    console.log(`[${extensionName}] Enabled: ${value}`);
}

jQuery(async () => {
    console.log(`[${extensionName}] Loading...`);

    try {
        const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
        $("#extensions_settings2").append(settingsHtml);

        $("#story_thinker_enabled").on("input", onEnabledChange);
        await loadSettings();

        eventSource.on(event_types.CHAT_COMPLETION_SETTINGS_READY, onChatCompletionReady);

        console.log(`[${extensionName}] ✅ Loaded successfully`);
    } catch (error) {
        console.error(`[${extensionName}] ❌ Failed to load:`, error);
    }
});    } catch (error) {
        console.error(`[${extensionName}] ❌ Failed to load:`, error);
    }
});
