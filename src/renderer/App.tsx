/**
 * React renderer.
 */
import '@public/style.css';
import { remote } from 'electron';
const { Tray, Menu, MenuItem , systemPreferences } = remote;
import * as path from 'path';
import * as React from 'react';

class App extends React.Component<{}, {}> {
    public state: any = {
        toggle: false,
        task: [],
        typed: '',
        duration: ''
    };
    private menu: any = new Menu();

    public componentDidMount(): any {
        const a: any = this.getTray;
        // let check: boolean = false
        this.menu.append(new MenuItem ({
            label: 'Open tray',
            type: 'checkbox',
            // checked: check,
            click(): any {
                // @ts-ignore
                a();
            }
        }));
    }

    public getTray = (): any => {
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
        // this.trayIcon.setHighlightMode('always');
        trayIcon.getBounds();
        trayIcon.setContextMenu(trayMenu);
        trayIcon.setToolTip('this is an app');

    }

    //
    public getClick = (e: any): any => {
        e.preventDefault();
        this.menu.popup(remote.getCurrentWindow());
    }

    public submitForm = (e: any): any => {
        e.preventDefault();
        this.setState({
            task: this.state.task.concat({ item: this.state.typed, duration: this.state.duration}),
            typed: '',
            duration: ''
        });
    }

    public onType = (e: any): any => {
        this.setState({ typed: e.target.value });
    }

    public onSelect = (e: any): any => {
        console.log(e)
        this.setState({duration: e.target.value});
    }

    // tslint:disable-next-line
    render() {
        return (
            <div className='app' onContextMenu={(e: any): any => this.getClick(e)}>
                <form onSubmit={(e: any): any => this.submitForm(e)}>
                    <h3 className='title'>Tasker</h3>
                    <input type='text'
                           placeholder='What are you doing today'
                           onChange={(e: any): any => this.onType(e)}
                           value={this.state.typed}
                           className='input-class'/>
                    <select onChange={(e) => this.onSelect(e)}
                            value={this.state.duration}>
                        <option selected value=''>---Choose Time---</option>
                        <option value='5'>5 min</option>
                        <option value='10'>10 min</option>
                    </select>
                </form>
                <ul>
                    {this.state.task.map((item: any, i: any) => {
                        return (
                            <li key={i}>{item.item}<small style={{ textAlign: 'right' }}>{item.duration}</small></li>
                    );
                    })}
                </ul>
            </div>
        );
    }
}

export { App };
