import joplin from 'api'
import { ChangeEvent } from 'api/JoplinSettings'
import { Settings, EThemeVariant } from './settings'

interface ITheme {
    window: string,
    note: string,
}
interface IThemeMap {
    [index: string]: ITheme
}

const themesStylesheets: IThemeMap = {
    dark: {
        window: '/styles/dark/window.css',
        note: '/styles/dark/note.css',
    },
    light: {
        window: '/styles/light/window.css',
        note: '/styles/light/note.css',
    },
}


joplin.plugins.register({
    onStart: async function () {
        const settings = new Settings()
        const installDir = await joplin.plugins.installationDir()

        const setTheme = async (theme: ITheme) => {
            if (theme) {
                console.log('Setting theme:', installDir, theme)
                await (joplin as any).window.loadChromeCssFile(installDir + theme.window)
                await (joplin as any).window.loadNoteCssFile(installDir + theme.note)
            } else {
                throw 'Invalid theme selected'
            }
        }

        settings.register().then(() => {
            setTheme(themesStylesheets[settings.get('themeVariant')])
        })
        joplin.settings.onChange(async (event: ChangeEvent) => {
            await settings.read(event)
            setTheme(themesStylesheets[settings.get('themeVariant')])
        })
    },
})
