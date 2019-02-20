/**
 * React renderer.
 */
import '@public/style.css';
import { remote } from 'electron';
const { Menu, MenuItem } = remote;
import update from 'immutability-helper';
import * as React from 'react';
import TaskForm from './TaskForm';
import getTray from './tray';

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
        this.menu.append(new MenuItem ({
            label: 'Open tray',
            type: 'checkbox',
            click(): any {
                getTray();
            }
        }));
    }

    public getClick = (e: any): any => {
        e.preventDefault();
        this.menu.popup(remote.getCurrentWindow());
    }

    public submitForm = (e: any): any => {
        e.preventDefault();
        this.setState(update(this.state, {
            tasks: {
                $push: [{ item: this.state.typed, duration: this.state.duration, taskStatus: Status.Pending }]
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

    public selectDuration = (e: any): any => {
        this.setState(update(this.state, {
            duration: {
                $set: e.target.value
            }
        }));
    }

    public deleteTask = (item: any, index: any) => {
        this.setState(update(this.state, {
            tasks: {
                $splice: [[index, 1]]
            }
        }));
    }

    public onStart = (item: ITask, index: any) => {
        this.setState(update(this.state, {
            tasks: {
                [index]: {
                  $set: {...item, taskStatus: Status.Pending }
                }
            }
        }));
        setTimeout(() => {
            console.log('hi there');
            this.setState(update(this.state, {
                tasks: {
                    [index]: {
                        $set: {...item, taskStatus: Status.Complete }
                    }
                }
            }));
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
                <TaskForm selectDuration={this.selectDuration}
                          onType={this.onType}
                          submitForm={this.submitForm}
                          typed={this.state.typed}
                          duration={this.state.duration}/>
                <ul>
                    {
                        this.state.tasks.map((item: ITask, i: any) => {
                            return (
                                <li key={i}>
                                    <span className='delete' onClick={() => this.deleteTask(item.item, i)}>X</span>
                                    {item.item}
                                    {item.taskStatus === Status.Pending ?
                                        <button className='btn btn-start'
                                                onClick={() => this.onStart(item, i)}>
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
