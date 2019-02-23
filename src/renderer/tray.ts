import Utils from '@main/utils';
import {remote} from 'electron';
const {Tray, Menu, systemPreferences} = remote;

const getTray = () => {
    const trayIcon: any = systemPreferences.isDarkMode()
        ? new Tray(Utils.getWhiteIcon())
        : new Tray(Utils.getDarkIcon());

    const trayMenuTemplate: any = [
        {
            label: 'Empty Application',
            enabled: false
        },
        {
            label: 'Settings',
            click(): any {
                console.log('Clicked on settings');
            }
        },
        {
            label: 'Help',
            click(): any {
                console.log('Clicked on Help');
            }
        },
        {
            label: 'Exit',
            click(): any {
                trayIcon.destroy();
            }
        }
    ];

    const trayMenu: any = Menu.buildFromTemplate(trayMenuTemplate);
    // trayIcon.getBounds();
    trayIcon.setContextMenu(trayMenu);
    trayIcon.setToolTip('this is an app');
};

export default getTray;
