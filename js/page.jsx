// page.jsx

import React from 'react';
import Data from './data.js';
import Mine from './mine.jsx';
import Flux from './flux.js';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mines: Data.mines,
            gameState: 'playing'
        };
        Flux.register('minefieldListener', payload => {
            if (payload.action === 'updatemines') {
                this.setState({mines: Data.mines}, payload.callback);
            }
        });
        Flux.register('resetControlListener', payload => {
            if (payload.action === 'gameover') {
                this.setState({gameState: payload.result});
            }
        });
        this.mouseUp = e => {
            Flux.dispatch({
                action: 'canclepreview'
            });
        };
        this.resetGame = () => {
            Flux.dispatch({
                action: 'resetgame'
            });
            this.setState({gameState: 'playing'});
        };
    }
    componentDidMount() {
        Data.reset(0, 0, () => {});
        Data.started = false;
    }
    render() {
        return (
            <div onMouseUp={this.mouseUp} onContextMenu={e => { e.preventDefault(); }}>
                <h1> Minesweeper </h1>
                <a onClick={this.resetGame}> 
                    {(() => {
                        switch (this.state.gameState) {
                            case 'playing':
                                return 'Start Over';
                                break;
                            case 'win':
                                return 'You Win! Play Again?';
                                break;
                            case 'lose':
                                return 'You Lose! Play Again?';
                                break;
                        }
                    })()}
                </a>
                <ul className='rows'>
                    {(() => {
                        return this.state.mines.map((row, x) => {
                            return (<ul className='cols' key={x}>
                                {(() => {
                                    return row.map((mine, y) => {
                                        return <Mine key={y} value={this.state.mines[x][y]} x={x} y={y} />
                                    });
                                })()}
                            </ul>)
                        });

                    })()}
                </ul>
            </div>

        )
    }
}

export default Page;
