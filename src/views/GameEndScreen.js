import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
import './GameEndScreen.css';
import {FaChevronRight, FaChevronLeft} from "react-icons/fa";
import {Button, Carousel, Collapse} from "antd";
import {AppContext} from "../contexts/AppContext";
const { Panel } = Collapse;

export default function GameEndScreen({game, endScreenState, onPlayAgainClicked, onGameEndScreenStateChanged}) {

    const [{user}] = useContext(AppContext);

    const [transformedGame, setTransformedGame] = useState(null);
    const carouselRefs = useRef([]);

    if (transformedGame && carouselRefs.current.length !== transformedGame.words.length) {
        carouselRefs.current = transformedGame.words.map((_, i) => carouselRefs.current[i] || createRef());
    }

    const getCarouselRef = () => {
        return carouselRefs.current[endScreenState.panel] ? carouselRefs.current[endScreenState.panel].current : null;
    }

    const onCarouselPreviousClicked = () => {
        onGameEndScreenStateChanged({...endScreenState, carouselIndex: endScreenState.carouselIndex - 1});
    };

    const onCarouselNextClicked = () => {
        if (endScreenState.guessIsShowing || endScreenState.carouselIndex === 0) {
            onGameEndScreenStateChanged({...endScreenState, guessIsShowing: false, carouselIndex: endScreenState.carouselIndex + 1});
        } else {
            onGameEndScreenStateChanged({...endScreenState, guessIsShowing: true});
        }
    };

    const onPanelChange = (index) => {
        if (game.host !== user.id) {
            return;
        }
        onGameEndScreenStateChanged({panel: index, guessIsShowing: false, carouselIndex: 0});
    };

    useEffect(() => {
        getCarouselRef() && getCarouselRef().goTo(endScreenState.carouselIndex, true);
    }, [carouselRefs.current, endScreenState]);

    useEffect(() => {
        const words = game.words.map(word => {
            const rounds = [{word: word.word, player: word.player}];
            let index = 1;
            word.rounds.forEach((round, i) => {
                if (i % 2 === 0) {
                    rounds.push(round);
                } else {
                    rounds[index].guess = round.guess;
                    rounds[index].guessedBy = round.player.name;
                    index++;
                }
            })
            return {
                ...word,
                rounds
            }
        });
        setTransformedGame({...game, words});
    }, [game]);

    if (!transformedGame) {
        return <div>Nothing here...</div>
    }

    const panelEntries = transformedGame.words.map((word, index) => {
        const carouselEntries = word.rounds.map((round, index) => {
            return (
                <div key={`${word}-${round.player.id}`}>
                    <div style={{height: '50vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        {index === 0 && <h1>{round.word}</h1>}
                        {index > 0 && (
                            <>
                                <div style={{position: 'absolute', top: '1rem', left: '1rem'}}>
                                    Drawn by: <b>{round.player.name}</b>
                                </div>
                                <img style={{maxWidth: '100%', maxHeight: '100%'}} src={round.image}/>
                                {endScreenState.guessIsShowing && (
                                    <div style={{position: 'absolute', top: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '3rem', paddingLeft: '10rem', paddingRight: '10rem', backgroundColor: 'rgba(30,120,120,0.7)'}}>
                                        {round.guessedBy} guessed: <h1 style={{marginBottom: 0, marginLeft: 8}}>{round.guess}</h1>
                                    </div>
                                )}
                            </>
                            )}
                    </div>
                </div>
            )
        });
        return (
            <Panel header={word.player.name} key={index}>
                <div style={{width: '100%', position: 'relative'}}>
                    <Carousel ref={carouselRefs.current[index]} style={{height: '50vh', width: '100%'}} dots={false}>
                        {carouselEntries}
                    </Carousel>
                    <Button
                        style={{width: '4rem', height: '4rem', position: 'absolute', top: '50%', left: '1rem'}}
                        disabled={endScreenState.carouselIndex < 1 || game.host !== user.id}
                        type={'ghosted'}
                        shape={'round'}
                        icon={<FaChevronLeft />}
                        onClick={onCarouselPreviousClicked}
                    />
                    <Button
                        style={{width: '4rem', height: '4rem', position: 'absolute', top: '50%', right: '1rem'}}
                        disabled={endScreenState.carouselIndex > (transformedGame.words[0].rounds.length - 2) && endScreenState.guessIsShowing || game.host !== user.id}
                        type={'ghosted'}
                        shape={'round'}
                        icon={<FaChevronRight />}
                        onClick={onCarouselNextClicked}
                    />
                </div>
            </Panel>
        )
    })

    return (
        <div className={'GameEndScreen'}>
            <div className={'GameEndScreen-header'}>
                Game Ended
            </div>
            <Collapse style={{width: '80vw'}} accordion={true} onChange={onPanelChange} disabled={game.host !== user.id} activeKey={endScreenState.panel}>
                {panelEntries}
            </Collapse>
            <Button style={{marginTop: '1rem'}} type={'primary'} size={'large'} onClick={onPlayAgainClicked}>Play Again</Button>
        </div>
    );
}
