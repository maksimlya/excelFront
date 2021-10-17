import React, {Component} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import './Layout.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export class CalendarLayout extends Component {
    constructor(props) {
        super(props);
        console.log(props.data);
        this.state = {
            layout: []
        }
    }

    componentDidMount = () => {
        let x = 0;
        let y = 0;
        let layout = [...this.state.layout];
        for(let week of Object.keys(this.props.data)) { 
            for(let day of Object.keys(this.props.data[week])) {
                layout.push({i: day + y + x, x, y, h:4, w:1, value: this.props.data[week][day], static:false});
                x++;
            }
            y++;
            x = 0;
        }
        this.setState({layout});
        window.getData = layout;
    }

    onClick = () => {
        console.log('LOL')
        }

    render() {
        return (
            <div className="container">
                <ResponsiveGridLayout 
                    className="layout" 
                    layouts={{lg:this.state.layout}} 
                    isDraggable={false}
                    isResizable={false}
                    isRearrangeable={false}
                    breakpoints={{lg:1200,md:996}}
                    cols={{lg:12,md:10,sm:6}} 
                    rowHeight={20}
                    width={750}>
                    {this.state.layout.map(a => {
                        return(
                            <div key={a.i} className="myk">
                                <div className='myj'>{a.value}</div>
                                <div className='myj'></div>
                                <div className='myj'></div>
                                <div className='myj' onClick={this.onClick}></div>
                            </div>
                        );
                    })} 
                    <div key="person1" className="people" data-grid={{x:8,y:0,h:1,w:1}}>person1</div>
                    <div key="person2" className="people" data-grid={{x:8,y:1,h:1,w:1}}>person2</div>
                    <div key="person3" className="people" data-grid={{x:8,y:2,h:1,w:1}}>person3</div>
                    <div key="person4" className="people" data-grid={{x:8,y:3,h:1,w:1}}>person4</div>
                </ResponsiveGridLayout>
            </div>
        );
    }
}