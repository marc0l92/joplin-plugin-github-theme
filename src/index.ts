import joplin from 'api'
import { ChangeEvent } from 'api/JoplinSettings'
import { Settings } from './settings'

const themesStylesheets = {
    window: '/css/window.css',
    note: '/css/note.css',
    colors: {
        dark: '/css/dark/colors.css',
        light: '/css/light/colors.css',
    }
}

joplin.plugins.register({
    onStart: async function () {
        const settings = new Settings()
        const installDir = await joplin.plugins.installationDir()

        const setTheme = async (themeColor) => {
            if (themeColor && themeColor in themesStylesheets.colors) {
                console.log('Setting theme color:', themeColor)
                await (joplin as any).window.loadChromeCssFile(installDir + themesStylesheets.window)
                await (joplin as any).window.loadChromeCssFile(installDir + themesStylesheets.colors[themeColor])

                await (joplin as any).window.loadNoteCssFile(installDir + themesStylesheets.note)
                await (joplin as any).window.loadNoteCssFile(installDir + themesStylesheets.colors[themeColor])
            }
        }

        settings.register().then(() => {
            setTheme(settings.get('themeVariant'))
        })
        joplin.settings.onChange(async (event: ChangeEvent) => {
            await settings.read(event)
            // I have no way to delete the previous CSS
            // The user needs to restart Joplin to apply the changes
            // setTheme(themesStylesheets[settings.get('themeVariant')])
        })
    },
})
