
import React from 'react';
import Flux from './flux.js';
import Data from './data.js';

class Page extends React.Component {
    constructor(props) {
        super(props);
        let visibility = true;
        let preview = false;
        this.state = {
            visibility: 'hidden',
            flagged: false,
            preview: ''
        };
        this.mouseDown = e => {
            if (!Data.over) {
                if (e.buttons === 1) this.leftClick();
                if (e.buttons === 2) this.rightClick();
                if (e.buttons === 3) {
                    Data.flags.reset(this.props.value);
                    Flux.dispatch({
                        action: 'activatepreview'
                    });
                    this.preview();
                }
            }
        };
        this.leftClick = () =>  {
            if (this.state.flagged !== true) {
                const reveal = () => {
                    if (this.props.value === 9) {
                        console.log('game over');
                        Data.over = true;
                        Flux.dispatch({
                            action: 'gameover',
                            result: 'lose'
                        });
                    }
                    if (visibility) Data.uncover();
                    this.setState({visibility: ''}); 
                    visibility = false;
                    if (this.props.value === 0) {
                        window.setTimeout(() => {
                            Flux.dispatch({ 
                                action: 'tryclear', 
                                x: this.props.x, 
                                y: this.props.y
                            });
                        }, 0);
                    }
                };
                if (!Data.started) {
                    Data.reset(this.props.x, this.props.y, reveal);
                } else {
                    reveal();
                }
            }
        };
        this.rightClick = () =>  {
            if (this.state.visibility === 'hidden') this.setState({flagged: !this.state.flagged}); 
        };
        this.preview = () => {
            Data.flags.reset(this.props.value);
            Flux.dispatch({
                action: 'showpreview',
                x: this.props.x, 
                y: this.props.y
            });
        };
        this.mouseOver = e => {
            if (preview) this.preview();
        };
        Flux.register('resetListener' + this.props.x + ',' + this.props.y, payload => {
            if (payload.action === 'resetgame') {
                this.setState({
                    visibility: 'hidden',
                    flagged: false,
                    preview: ''
                });
                visibility = true;
                preview = false;
            }
        });
        Flux.register('previewListener' + this.props.x + ',' + this.props.y, payload => {
            if (payload.action === 'activatepreview') {
                preview = true;
            }
            if (payload.action === 'canclepreview') {
                preview = false;
                if (this.state.preview) {
                    this.setState({preview: ''});
                    if (Data.flags.getCount()) this.leftClick();
                }
            }
        });
        Flux.register('mineListener' + this.props.x + ',' + this.props.y, payload => {
            const detectAdjacent = func => {
                if (payload.x - 1 === this.props.x && payload.y - 1 === this.props.y) func();
                if (payload.x === this.props.x && payload.y - 1 === this.props.y) func();
                if (payload.x + 1 === this.props.x && payload.y - 1 === this.props.y) func();
                if (payload.x - 1 === this.props.x && payload.y + 1 === this.props.y) func();
                if (payload.x - 1 === this.props.x && payload.y === this.props.y) func();
                if (payload.x === this.props.x && payload.y + 1 === this.props.y) func();
                if (payload.x + 1 === this.props.x && payload.y === this.props.y) func();
                if (payload.x + 1 === this.props.x && payload.y + 1 === this.props.y) func();
            };
            if (payload.action === 'tryclear') {
                if (this.props.value !== 9 && visibility === true) {
                    detectAdjacent(this.leftClick);
                }
            };
            if (payload.action === 'showpreview') {
                let previewed = false;
                if (this.state.flagged) {
                    detectAdjacent(() => {
                        Data.flags.add();
                    });
                }
                if (!this.state.flagged && this.state.visibility === 'hidden') {
                    detectAdjacent(() => {
                        this.setState({preview: ' preview'});
                        previewed = true;
                    });
                }
                if (!previewed) this.setState({preview: ''});
            };
        });
    }
    render() {
        return (
            <div 
                className={'mine ' + this.state.visibility + this.state.preview + ' color' + this.props.value} 
                onMouseOut={this.mouseOut} 
                onMouseOver={this.mouseOver} 
                onContextMenu={e => { e.preventDefault(); }} 
                onMouseDown={this.mouseDown} >

                {( () => { if (this.state.visibility !== 'hidden' && this.props.value > 0) {
                    if (this.props.value === 9) return <img src="./img/bomb.png" />;
                    return this.props.value;
                } }) () }
                {( () => { if (this.state.flagged === true) return <img src="./img/flag.png" className="flag" /> }) () }
            </div>

        )
    }
}

export default Page;
