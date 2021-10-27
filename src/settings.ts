import joplin from 'api'
import { ChangeEvent } from 'api/JoplinSettings'
import { SettingItem, SettingItemType } from 'api/types'


interface SettingItems {
    [key: string]: SettingItem,
}

enum EThemeVariant {
    dark = "Dark",
    light = "Light",
    disabled = "Disabled"
}

export const SettingDefaults = {
    Variant: EThemeVariant.dark
}

export class Settings {

    // Settings definitions
    private _config: SettingItems = {
        themeVariant: {
            value: SettingDefaults.Variant,
            type: SettingItemType.String,
            section: 'githubTheme.settings',
            public: true,
            advanced: false,
            isEnum: true,
            options: EThemeVariant,
            label: 'Theme variant',
            description: 'You must restart Joplin to apply the theme.',
        },
    }

    // Checks on the settings
    private _checks = {
    }

    // Getters
    get(key: string): any {
        if (key in this._config) {
            return this._config[key].value
        }
        throw 'Setting not found: ' + key
    }

    // Register settings
    async register() {
        await joplin.settings.registerSection('githubTheme.settings', {
            label: 'GitHub Theme',
            iconName: 'fa fa-palette',
            description: 'Joplin theme with the colors of GitHub.'
        })

        await joplin.settings.registerSettings(this._config)

        // Initially read settings
        return await this.read()
    }

    // Get setting on change
    private async getOrDefault(event: ChangeEvent, localVar: any, setting: string): Promise<any> {
        if (!event || event.keys.includes(setting)) {
            return await joplin.settings.value(setting)
        }
        return localVar
    }

    // Store settings on change
    async read(event?: ChangeEvent) {
        for (let key in this._config) {
            this._config[key].value = await this.getOrDefault(event, this._config[key].value, key)
            if (key in this._checks) {
                this._config[key].value = this._checks[key](this._config[key].value)
                await joplin.settings.setValue(key, this._config[key].value)
            }
        }
    }
}
