/**
 * React renderer.
 */
import Utils from '@main/utils';
import '@public/style.css';
import { remote } from 'electron';
const { Tray, Menu, MenuItem , systemPreferences } = remote;
import * as React from 'react';

interface IState {
    toggle: boolean;
    tasks: ITask[];
    typed: string;
    duration: number;
}

interface ITask {
    item: string;
    duration: number;
    taskStatus: string;
}

enum Status {
    Pending = 'pending',
    InProgress = 'in progress',
    Complete = 'complete'
}

class App extends React.Component<{}, IState> {
    public state: IState = {
        toggle: false,
        tasks: [],
        typed: '',
        duration: 0,
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
            tasks: this.state.tasks.concat(
                { item: this.state.typed, duration: this.state.duration, taskStatus: Status.Pending }
            ),
            typed: '',
            duration: 0
        });
    }

    public onType = (e: any): any => {
        this.setState({ typed: e.target.value });
    }

    public onSelect = (e: any): any => {
        this.setState({duration: e.target.value});
    }

    public deleteTask = (item: any) => {
        this.setState({ tasks: this.state.tasks.filter((f) => f.item !== item)});
    }

    public onStart = (item: ITask) => {
        // this.setState({ tasks: Status.Pending });
        setTimeout(() => {
            console.log('hi there');
            // this.setState({ tasks: Status.Complete });
        }, 1000 * 60 * item.duration);
    }

    public timeAndStatus = (item: ITask) => {
        switch (item.taskStatus) {
            case Status.Pending:
                return <>{item.duration}:00 min</>;
            case Status.InProgress:
                return <>i dunno</>;
            case Status.Complete:
                return <>Done and dusted</>;
        }
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
                                <option defaultValue={''} value={0}>Duration</option>
                                <option value={1}>1 min</option>
                                <option value={5}>5 min</option>
                                <option value={10}>10 min</option>
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
                        this.state.tasks.map((item: ITask, i: any) => {
                            return (
                                <li key={i}>
                                    <span className='delete' onClick={() => this.deleteTask(item.item)}>X</span>
                                    {item.item}
                                    {item.taskStatus === Status.Pending ?
                                        <button className='btn btn-start'
                                                onClick={() => this.onStart(item)}>
                                            Start
                                        </button>
                                        : null
                                    }
                                    <span className='duration-class'>{this.timeAndStatus(item)}</span>
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
