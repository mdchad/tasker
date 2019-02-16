/**
 * React renderer.
 */
import '@public/style.css';
import { remote } from 'electron';
const { Tray, Menu, MenuItem , systemPreferences } = remote;
import * as path from 'path';
import * as React from 'react';

interface IState {
    toggle: boolean;
    task: ITask[];
    typed: string;
    duration: string;
}

interface ITask {
    item: string;
    duration: string;
}

class App extends React.Component<{}, IState> {
    public state: IState = {
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
        trayIcon.getBounds();
        trayIcon.setContextMenu(trayMenu);
        trayIcon.setToolTip('this is an app');

    }

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
        this.setState({duration: e.target.value});
    }

    public deleteTask = (item: any) => {
        console.log(item);
        console.log(this.state.task.filter((f) => f.item === item));
        this.setState({ task: this.state.task.filter((f) => f.item !== item)});
    }
    // tslint:disable-next-line
    render() {
        return (
            <div className='app' onContextMenu={this.getClick}>
                <form onSubmit={this.submitForm}>
                    <div style={{width: '100%'}}>
                        <h3 className='title'>Tasker</h3>
                        <input type='text'
                               placeholder='What are you doing today'
                               onChange={this.onType}
                               value={this.state.typed}
                               className='input-class'/>
                        <span className='custom-dropdown'>
                            <select onChange={this.onSelect}
                                    value={this.state.duration}>
                                <option defaultValue={''} value=''>Duration</option>
                                <option value='5'>5 min</option>
                                <option value='10'>10 min</option>
                            </select>
                        </span>
                    </div>
                    <div className='wrapper'>
                        <button disabled={!(this.state.typed && this.state.duration)}
                                className='btn'
                                onClick={(e: any): any => this.submitForm(e)}>Submit</button>
                    </div>
                </form>
                <ul>
                    {
                        this.state.task.map((item: any, i: any) => {
                            return (
                                <li key={i}>
                                    {item.item}
                                    <span className='delete' onClick={() => this.deleteTask(item.item)}>X</span>
                                    <span className='duration-class'>{item.duration}</span>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export { App };
