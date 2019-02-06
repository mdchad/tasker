/**
 * React renderer.
 */
import '@public/style.css';
// tslint:disable-next-line
import { remote } from 'electron';
const { Menu, MenuItem } = remote
import * as React from 'react';

class App extends React.Component<{}, {}> {
    private menu: any= new Menu()

    public componentDidMount(): any {
        this.menu.append(new MenuItem ({
            label: 'MenuItem1',
            click(): any {
                console.log('item 1 clicked')
            }
        }))
    }
    //
    public getClick = (e: any): any => {
        e.preventDefault()
        // @ts-ignore
        this.menu.popup(remote.getCurrentWindow());
        // console.log('hello world', Menu);
        // const template: any = [
        //     {
        //         label: 'Filter',
        //         submenu: [
        //             {
        //                 label: 'Hello',
        //                 accelerator: 'Shift+CmdOrCtrl+H',
        //                 click(): any {
        //                     // tslint:disable-next-line
        //                     console.log('hello world')
        //                 }
        //             }
        //         ]
        //     }
        // ];
        // const menu: Menu = Menu.buildFromTemplate(template);
        // menu.popup({});
    }

    // tslint:disable-next-line
    render() {
        return (
            <div className='app' onContextMenu={(e) => this.getClick(e)}>
                <h4>Welcome to React, Electron and Typescript hello world</h4>
            </div>
        );
    }
}

export { App };
