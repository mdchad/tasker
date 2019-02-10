/**
 * React renderer.
 */
import '@public/style.css';
// tslint:disable-next-line
import { remote } from 'electron';
const { Tray, Menu, MenuItem , systemPreferences } = remote
import * as path from 'path';
import * as React from 'react';

class App extends React.Component<{}, {}> {
    public state: { toggle: boolean } = {
        toggle: false
    };
    private menu: any = new Menu();

    public componentDidMount(): any {
        const a: any = this.getTray;
        this.menu.append(new MenuItem ({
            label: 'Open tray',
            click(): any {
                console.log('item 1 clicked');
                // @ts-ignore
                a();
            }
        }));
    }


    public getTray = (): any => {
        // tslint:disable-next-line
        let self = this;
        const trayIcon: any = systemPreferences.isDarkMode()
            ? new Tray(path.join('',
                '/Users/chad/' +
                'Desktop/code/tasker/dist/assets/icons/png/16x16-white.png'))
            : new Tray(path.join('',
                '/Users/chad/' +
                'Desktop/code/tasker/dist/assets/icons/png/16x16-white.png'));

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
                    self.setState({ toggle: true });
                    console.log('Clicked on Help');
                }
            }
        ];

        const trayMenu: any = Menu.buildFromTemplate(trayMenuTemplate);
        // this.trayIcon.setHighlightMode('always');
        trayIcon.getBounds();
        trayIcon.setContextMenu(trayMenu);
        trayIcon.setToolTip('this is an app');
    }

    //
    public getClick = (e: any): any => {
        e.preventDefault()
        // @ts-ignore
        this.menu.popup(remote.getCurrentWindow());
    }

    // tslint:disable-next-line
    render() {
        return (
            <div className='app' onContextMenu={(e) => this.getClick(e)}>
                <h3 className='title'>Tasker</h3>
                <input type='text'
                       placeholder='What are you doing today'
                       className='input-class'/>
            </div>
        );
    }
}

export { App };
