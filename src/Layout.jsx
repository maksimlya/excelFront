import React, {Component} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {MonthPicker} from './Picker';
import { Calendar } from './Calendar';
import './Layout.css';
import '../node_modules/react-month-picker/css/month-picker.css';
import { ColorPicker } from './ColorPicker';

const ResponsiveGridLayout = WidthProvider(Responsive);

export class CalendarLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: [],
            people: JSON.parse(localStorage.getItem('people')) || {},
            assignments: {},
            chosenColor: '#FFFFFE',
            nameText: '',
            selectedPerson: null,
            selectedMonth: null,
            selectedYear: null
        }
        this.nameInput = React.createRef();
        this.selectedPerson = React.createRef();
    }

    addPerson = () => {
        const newPerson = {
            name: this.state.nameText,
            color: this.state.chosenColor
        }
        const people = this.state.people;
        people[newPerson.name] = newPerson;
        this.setState({people, nameText:'', chosenColor: '#FFFFFE'});
        localStorage.setItem('people', JSON.stringify(people));
    }

    calendarPickerCallback = res => {
        this.initCalendar(res.month, res.year);
    }

    initCalendar = (month, year) => {
        const data = new Calendar(month-1,year).getData();
        let x = 0;
        let y = 0;
        let layout = [];
        for(let week of Object.keys(data)) { 
            for(let day of Object.keys(data[week])) {
                layout.push({i: day + '.' + y + '.' + x, x, y, h:4, w:1, value: data[week][day], static:false});
                x++;
            }
            y++;
            x = 0;
        }

        const assignments = JSON.parse(localStorage.getItem('assignments.' + month + '.' + year)) || {};
        for(let [key, value] of Object.entries(assignments)) {
            if(!this.state.people[value]) {
                delete assignments[key];
            }
        }
        localStorage.setItem('assignments.' + month + '.' + year, JSON.stringify(assignments));
        
        this.setState({layout, assignments, selectedMonth: month, selectedYear: year});
        window.data = this;
    }

    componentDidMount = () => {
        this.initCalendar(new Date().getMonth() + 1, new Date().getFullYear());
    }
    
    removeAssignment = e => {
        if(e.target.innerText) {
            e.target.innerText = '';
            e.target.style.backgroundColor = '';
        }
        e.preventDefault();
    }
    removePerson = e => {
        const people = this.state.people;
        const assignments = this.state.assignments;


        for(let [key, value] of Object.entries(assignments)) {
            if(e.target.innerText === value) {
                delete assignments[key];
            }
        }
        delete people[e.target.innerText];

        localStorage.setItem('assignments.' + this.state.selectedMonth + '.' + this.state.selectedYear, JSON.stringify(assignments));
        localStorage.setItem('people', JSON.stringify(people));

        this.setState({people: {...people}, selectedPerson: null, assignments: {...assignments}});
        e.preventDefault();
    }

    onPersonSelect = e => {
        if(this.selectedPerson.current) {
            this.selectedPerson.current.id = '';
        }
        this.setState({selectedPerson: e.target.innerText === this.state.selectedPerson ? null : e.target.innerText});
        this.selectedPerson.current = e.target.parentNode;
        this.selectedPerson.current.id = 'selected';
    }

    onClick = e => {
        if(e.target.innerText) {
            e.target.innerText = '';
            e.target.style.backgroundColor = '';
        }
        if(this.state.selectedPerson) {
            e.target.style.backgroundColor = this.state.people[this.state.selectedPerson].color;
            e.target.innerText = this.state.selectedPerson;
            const assignments = this.state.assignments;
            assignments[e.target.id] = this.state.selectedPerson;
            localStorage.setItem('assignments.' + this.state.selectedMonth + '.' + this.state.selectedYear, JSON.stringify(assignments));
            this.setState({assignments: {...assignments}});
        }
    }
    
    handleColorChange = color => {
        this.setState({chosenColor: color.hex});
    }

    updateText = e => {
        this.setState({nameText: e.target.value});
    }

    render() {
        return (
            <div className="container">
                <ResponsiveGridLayout 
                    className="layout" 
                    layouts={{lg:this.state.layout, md: this.state.layout}} 
                    isDraggable={false}
                    isResizable={false}
                    isRearrangeable={false}
                    compactType={null}
                    breakpoints={{lg:1200,md:996}}
                    cols={{lg:8,md:8,sm:8}} 
                    rowHeight={20}
                    width={750}>
                    {this.state.layout.map(a => {
                        return(
                            <div key={a.i} id={a.i} className="myk">
                                <div className='myi'>{a.value}</div>
                                <div className='myj' id={a.i+'.morning'} onClick={this.onClick} onContextMenu={this.removeAssignment} style={{backgroundColor: this.state.people[this.state.assignments[a.i+'.morning']]?.color}}>{this.state.people[this.state.assignments[a.i+'.morning']]?.name}</div>
                                <div className='myj' id={a.i+'.noon'} onClick={this.onClick} onContextMenu={this.removeAssignment} style={{backgroundColor: this.state.people[this.state.assignments[a.i+'.noon']]?.color}}>{this.state.people[this.state.assignments[a.i+'.noon']]?.name}</div>
                                <div className='myj' id={a.i+'.evening'} onClick={this.onClick} onContextMenu={this.removeAssignment} style={{backgroundColor: this.state.people[this.state.assignments[a.i+'.evening']]?.color}}>{this.state.people[this.state.assignments[a.i+'.evening']]?.name}</div>
                            </div>
                        );
                    })} 

                    <div key="picker" className="picker" data-grid={{x:6,y:0,h:1,w:1}}><MonthPicker callback = {this.calendarPickerCallback}/></div>
                    <div key="nameInput" className="nameContainer" data-grid={{x:6,y:1,h:1,w:2}}>
                        <input ref={this.nameInput} onChange={this.updateText} value={this.state.nameText} className="nameInput" type="text"/>
                        <ColorPicker chosenColor={this.state.chosenColor} handleColorChange = {this.handleColorChange}/>
                    </div>
                    <div key="nameField" data-grid={{x:6,y:2,h:1,w:1}}><button disabled={!this.state.nameText || this.state.chosenColor === '#FFFFFE'} className="nameField" onClick={this.addPerson}>Add New</button></div>
                   
                    {Object.values(this.state.people).map(a =>
                        <div key={a.name} className="people" data-grid={{x:6, y:Object.values(this.state.people).length*2,h:2,w:1}}>
                        <div className="content" onContextMenu={this.removePerson} onClick={this.onPersonSelect} style={{"backgroundColor":a.color}} >{a.name}</div>
                        </div>
                    )}
                </ResponsiveGridLayout>
            </div>
        );
    }
}