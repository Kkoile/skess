import React, {createRef, useEffect, useRef, useState} from 'react';
import './GameEndScreen.css';
import {FaChevronRight, FaChevronLeft} from "react-icons/fa";
import {Button, Carousel, Collapse} from "antd";
const { Panel } = Collapse;

export default function GameEndScreen({game, onPlayAgainClicked}) {

    const [guessIsShowing, setGuessIsShowing] = useState(false);
    const [transformedGame, setTransformedGame] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [panelIndex, setPanelIndex] = useState(undefined);
    const carouselRefs = useRef([]);

    if (transformedGame && carouselRefs.current.length !== transformedGame.words.length) {
        carouselRefs.current = transformedGame.words.map((_, i) => carouselRefs.current[i] || createRef());
    }

    const getCarouselRef = () => {
        return carouselRefs.current[panelIndex] ? carouselRefs.current[panelIndex].current : null;
    }

    const onCarouselPreviousClicked = () => {
        getCarouselRef().prev();
    };

    const onCarouselNextClicked = () => {
        if (guessIsShowing || carouselIndex === 0) {
            setGuessIsShowing(false);
            getCarouselRef().next();
        } else {
            setGuessIsShowing(true);
        }
    };

    const onPanelChange = (index) => {
        setPanelIndex(index)
        setGuessIsShowing(false);
        setCarouselIndex(0);
        getCarouselRef() && getCarouselRef().goTo(0, true);
    };

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
                                {guessIsShowing && (
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
            <Panel header={word.player.name} key={index} >
                <div style={{width: '100%', position: 'relative'}}>
                    <Carousel ref={carouselRefs.current[index]} style={{height: '50vh', width: '100%'}} dots={false} afterChange={setCarouselIndex}>
                        {carouselEntries}
                    </Carousel>
                    <Button
                        style={{width: '4rem', height: '4rem', position: 'absolute', top: '50%', left: '1rem'}}
                        disabled={carouselIndex < 1}
                        type={'ghosted'}
                        shape={'round'}
                        icon={<FaChevronLeft />}
                        onClick={onCarouselPreviousClicked}
                    />
                    <Button
                        style={{width: '4rem', height: '4rem', position: 'absolute', top: '50%', right: '1rem'}}
                        disabled={carouselIndex > (transformedGame.words[0].rounds.length - 2) && guessIsShowing}
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
            <Collapse style={{width: '80vw'}} accordion={true} onChange={onPanelChange}>
                {panelEntries}
            </Collapse>
            <Button style={{marginTop: '1rem'}} type={'primary'} size={'large'} onClick={onPlayAgainClicked}>Play Again</Button>
        </div>
    );
}
