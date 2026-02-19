jQuery(async () => {
    const html = `
        <div class="inline-drawer" style="border: 3px solid red; padding: 10px; margin: 10px;">
            <b>🔴 STORY THINKER TEST - CAN YOU SEE THIS?</b>
        </div>
    `;
    $("#extensions_settings").append(html);
    $("#extensions_settings2").append(html);
    $("body").append(html);
});        Object.assign(extension_settings[extensionName], defaultSettings);
    }
    $("#story_thinker_enabled").prop("checked", extension_settings[extensionName].enabled);
}

function onEnabledChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].enabled = value;
    saveSettingsDebounced();
}

jQuery(async () => {
    console.log(`[${extensionName}] Loading...`);

    try {
        const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
        $("#extensions_settings2").append(settingsHtml);
        $("#story_thinker_enabled").on("input", onEnabledChange);
        await loadSettings();
        console.log(`[${extensionName}] ✅ Drawer loaded`);
    } catch (error) {
        console.error(`[${extensionName}] ❌ Failed to load drawer:`, error);
    }

    // Hook into chat separately so a failure here won't break the drawer
    try {
        const { eventSource, event_types } = await import("../../../../script.js");
        eventSource.on(event_types.CHAT_COMPLETION_SETTINGS_READY, onChatCompletionReady);
        console.log(`[${extensionName}] ✅ Event hook registered`);
    } catch (error) {
        console.error(`[${extensionName}] ❌ Event hook failed:`, error);
    }
});            if (typeof sysMsg.content === 'string') {
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
