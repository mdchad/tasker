/**
 * React renderer.
 */

// This library does not have typescript typing
declare const Notification: any;

import '@public/style.css';
import { remote } from 'electron';
const { Menu, MenuItem } = remote;
import update from 'immutability-helper';
import * as React from 'react';
import TaskForm from './TaskForm';
import getTray from './tray';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

interface IState {
    toggle: boolean;
    tasks: ITask[];
    typed: string;
    duration: number;
    trayIcon: boolean;
}

interface ITask {
    item: string;
    duration: number;
    taskStatus: string;
    countdownValue: number;
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
        trayIcon: true
    };
    private menu: any = new Menu();
    private setTrayIcon: MenuItemConstructorOptions = {
        label: 'Open tray',
        type: 'checkbox',
        enabled: this.state.trayIcon
    };

    public click = () => {
        this.setState(update(this.state, {
            trayIcon: {
                $set: !this.state.trayIcon
            }
        }));
        getTray();
    }

    public componentDidMount(): any {
        this.setTrayIcon.click = this.click;
        this.menu.append(new MenuItem(this.setTrayIcon));
    }

    public getClick = (e: any): any => {
        e.preventDefault();
        this.menu.popup(remote.getCurrentWindow());
    }

    public getNotification = () => {
        return new Notification('hello yo', { body: 'Yo whatsaap'});
    }

    public submitForm = (e: any): any => {
        e.preventDefault();
        this.setState(update(this.state, {
            tasks: {
                $push: [
                    {
                        item: this.state.typed,
                        duration: this.state.duration,
                        taskStatus: Status.Pending,
                        countdownValue: this.state.duration
                    }
                ]
            },
            typed: {
                $set: ''
            },
            duration: {
                $set: 0
            }
        }));
    }

    public onType = (e: any): any => {
        this.setState(update(this.state, {
            typed: {
                $set: e.target.value
            }
        }));
    }

    public onSelectDuration = (e: any): any => {
        this.setState(update(this.state, {
            duration: {
                $set: e.target.value
            }
        }));
    }

    public onDeleteTask = (item: any, index: any) => {
        this.setState(update(this.state, {
            tasks: {
                $splice: [[index, 1]]
            }
        }));
    }

    public onStart = (item: ITask, index: any) => {
        let counter = 0;
        this.setState(update(this.state, {
            tasks: {
                [index]: {
                  $set: {...item, taskStatus: Status.InProgress }
                }
            }
        }));
        const b = () => {
            if (counter <= 60 * item.duration ) {
                console.log(counter);
                counter++;
            } else {
                clearInterval(s);
                this.setState(update(this.state, {
                    tasks: {
                        [index]: {
                            $set: {...item, taskStatus: Status.Complete }
                        }
                    }
                }));
            }

            if (counter === (item.duration * 60) / 2) {
                return new Notification(item.item, { body: 'You have 30 seconds left to finish your task'});
            }
        };
        const s = setInterval(b, 1000);
    }

    public getTimeAndStatus = (item: ITask, i: number) => {
        switch (item.taskStatus) {
            case Status.Pending:
                return (
                    <><button className='btn btn-start'
                                 onClick={() => this.onStart(item, i)}>Start</button>
                        {item.duration}:00 min
                    </>
                );
            case Status.InProgress:
                return <>{item.countdownValue} i what to dunno</>;
            case Status.Complete:
                return <>Done and dusted</>;
        }
    }
    // tslint:disable-next-line
    render() {
        return (
            <div className='app' onContextMenu={this.getClick}>
                <TaskForm selectDuration={this.onSelectDuration}
                          onType={this.onType}
                          submitForm={this.submitForm}
                          typed={this.state.typed}
                          duration={this.state.duration}/>
                <ul>
                    {
                        this.state.tasks.map((item: ITask, i: any) => {
                            return (
                                <li key={i}>
                                    <span className='delete' onClick={() => this.onDeleteTask(item.item, i)}>X</span>
                                    {item.item}
                                    <span className='duration-class'>{this.getTimeAndStatus(item, i)}</span>
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
