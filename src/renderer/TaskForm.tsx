import * as React from 'react';

interface IProps {
    submitForm: (e: any) => any;
    onType: (e: any) => any;
    selectDuration: (e: any) => any;
    typed: string;
    duration: number;
}

class TaskForm extends React.Component<IProps> {
    // tslint:disable-next-line
    render() {
        return (
            <form onSubmit={this.props.submitForm}>
                <div style={{width: '100%'}}>
                    <h3 className='title'>Tasker</h3>
                    <input type='text'
                           placeholder='What are you doing today'
                           onChange={this.props.onType}
                           value={this.props.typed}
                           className='input-class'/>
                    <span className='custom-dropdown'>
                            <select onChange={this.props.selectDuration}
                                    value={this.props.duration}>
                                <option defaultValue={''} value={0}>Duration</option>
                                <option value={1}>1 min</option>
                                <option value={5}>5 min</option>
                                <option value={10}>10 min</option>
                            </select>
                        </span>
                </div>
                <div className='wrapper'>
                    <button disabled={!(this.props.typed && this.props.duration)}
                            className='btn'
                            onClick={(e: any): any => this.props.submitForm(e)}>Submit</button>
                </div>
            </form>
        );
    }
}

export default TaskForm;
