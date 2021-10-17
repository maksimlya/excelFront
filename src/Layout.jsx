import React, {Component} from 'react';
import GridLayout from 'react-grid-layout';
import './Layout.css';

export class CalendarLayout extends Component {
    constructor(props) {
        super(props);
        console.log(props.data);
    }
    render() {
        const layout = [];
        let x = 0;
        let y = 0;
        for(let week of Object.keys(this.props.data)) {
            for(let day of Object.keys(this.props.data[week])) {
                layout.push({i: day + y, x, y, h:1, w:1, value: this.props.data[week][day], static:true});
                x++;
            }
            y++;
            x = 0;
            for(let i = 0 ; i < 7 ; i++) {
                layout.push({i: week+x+y, x,y,h:1,w:1,static:true});
                x++;
            }
            y++;
            x=0;
            for(let i = 0 ; i < 7 ; i++) {
                layout.push({i: week+x+x+y, x,y,h:1,w:1,static:true});
                x++;
            }
            y++;
            x=0;
            for(let i = 0 ; i < 7 ; i++) {
                layout.push({i: week+x+x+x+y, x,y,h:1,w:1,static:true});
                x++;
            }
            y++;
            x=0;
        }
        
        return (
            <GridLayout className="layout" layout={layout} cols={7} rowHeight={20} width={750}>
                {layout.map(a => {
                    return(
                        <div className='myj' key={a.i}>{a.value}</div>
                    );
                })}
            </GridLayout>
        );
    }
}