import React, { useState } from 'react';
import Oponent from "../components/battle/Oponent";
import Player from "../components/battle/Player";
import Message from "../components/battle/Message";
import wait from "../utils/wait";
import { STATUS, MESSAGE_SPEED } from "../constants/battle-constants";

const DEFAULT_PLAYERS_SKILL = [
    {
        name: 'かいはつ',
        attack: 10,
        maxPoint: 20,
        missRate: 20,
        pp: 20,
        maxPp: 20,
        type: 'こうげき',
    },
    {
        name: 'ちょうさ',
        attackUpRate: 1.5,
        deffenceUpRate: 0,
        maxPoint: 10,
        missRate: 0,
        pp: 10,
        maxPp: 10,
        type: 'のうりょくUP',
    },
    {
        name: 'べんきょう',
        attackUpRate: 0,
        deffenceUpRate: 1.5,
        maxPoint: 10,
        missRate: 0,
        pp: 10,
        maxPp: 10,
        type: 'のうりょくUP',
    },
];

const DEFAULT_PLAYER = {
    name: 'みならいプログラマー',
    level: 5,
    hp: 100,
    maxHp: 100,
    attackUpRate: 1,
    deffenceUpRate: 1,
    skills: DEFAULT_PLAYERS_SKILL,
};

const DEFAULT_OPONENT = {
    name: 'SQLインジェクション',
    level: 5,
    hp: 100,
    maxHp: 100,
    attack: 20
};

const BattleScene = () => {

    const [status, setStatus] = useState(STATUS.BATTLE_START);
    const [player, setPlayer] = useState(DEFAULT_PLAYER);

    const [oponent, setOponent] = useState(DEFAULT_OPONENT);

    const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);

    const [messageText, setMessageText] = useState(`あ！ やせいの\nSQLインジェクションがあらわれた！`);

    // 画面上をクリックしたときの処理
    const onClickHandler = () => {
        switch (status) {
            case STATUS.BATTLE_START:
                goToMainCommand();
                break;

            case STATUS.BATTLE_END:
                if (window.confirm('リトライしますか？')) {
                    window.location.reload();
                }
                break;

            case STATUS.NOT_FOUND:
                goToMainCommand();
                break;

            default:
                break;
        }
    }

    // たたかうを選択したときの処理
    const onClickFitght = () => {
        setStatus(STATUS.SELECT_SKILL_COMMAND);
    }

    // 戻るを選択したときの処理
    const onClickReturnMain = () => {
        goToMainCommand();
    }

    // わざを仮選択したときの処理
    const onClickSkill = (id) => {
        setSelectedSkillIndex(id);
    }

    // わざを確定したときの処理
    const onSelectSkill = () => {

        // stateの更新はラグがあるため、変数に一旦格納
        const tempPlayer = { ...player };
        const tempOponent = { ...oponent };

        // 選択したわざ
        const selectedSkill = tempPlayer.skills[selectedSkillIndex];
        setSelectedSkillIndex(null);

        // わざのPPを減らす
        tempPlayer.skills[selectedSkillIndex].pp --;
        setPlayer(tempPlayer);

        // 時間経過で戦闘を自動送りするため、非同期処理を実行
        Promise.resolve()
            // プレイヤーが攻撃を宣言！
            .then(() => startPlayersAttack())
            .then(() => wait(MESSAGE_SPEED))
            // プレイヤーの攻撃フェーズ
            .then(() => playersAttack())
            .then(() => wait(MESSAGE_SPEED))
            // 敵が攻撃を宣言！
            .then(() => startOponentsAttack())
            .then(() => wait(MESSAGE_SPEED))
            // 敵の攻撃フェーズ
            .then(() => oponentsAttack())
            .then(() => wait(MESSAGE_SPEED))
            // プレイヤーのコマンド選択に戻る
            .then(() => goToMainCommand())
            // 例外発生時 
            .catch(err => handleError(err));

        // プレイヤーが攻撃を宣言！
        const startPlayersAttack = () => {
            setMessageText(` ${player.name}の${selectedSkill.name}！`);
            setStatus(STATUS.ATTACK_PHASE);
        }

        // プレイヤーの攻撃フェーズ
        const playersAttack = () => {
            // わざが命中したかどうか
            const isMissed = Math.random() < selectedSkill.missRate / 100;

            if (isMissed) {
                setMessageText(`しかし、はずれてしまった！`);
            } else {
                // 攻撃が当たった場合
                switch (selectedSkill.type) {
                    case 'こうげき':
                        // ダメージ計算
                        const caluculatedDamage = Math.floor(selectedSkill.attack * tempPlayer.attackUpRate);
                        setMessageText(`${player.name}に${caluculatedDamage}のダメージ！`);

                        // 攻撃を当てた後のHP計算
                        const afterHp = tempOponent.hp - caluculatedDamage;

                        if (afterHp > 0) {
                            tempOponent.hp = afterHp;
                            setOponent(tempOponent);
                        } else {
                            tempOponent.hp = 0;
                            setOponent(tempOponent);
                            throw new Error('OPONENT_DEAD');
                        }
                        break;

                    case 'のうりょくUP':
                        if (selectedSkill.attackUpRate > 0) {
                            // 攻撃UPわざの場合
                            tempPlayer.attackUpRate = tempPlayer.attackUpRate * selectedSkill.attackUpRate;
                            setPlayer(tempPlayer);
                            setMessageText(`${tempPlayer.name}のこうげきがグーンとあがった！`);
                        } else if (selectedSkill.deffenceUpRate > 0) {
                            // 防御UPわざの場合
                            tempPlayer.deffenceUpRate = tempPlayer.deffenceUpRate * selectedSkill.deffenceUpRate;
                            setPlayer(tempPlayer);
                            setMessageText(`${tempPlayer.name}のぼうぎょがグーンとあがった！`);
                        } else {
                            setMessageText(`しかし、なにもおこらなかった。`);
                        }
                        break;
                    default:
                        throw new Error('INVALID_SKILL_TYPE');
                }
            }
        }

        // 敵が攻撃を宣言！
        const startOponentsAttack = () => {
            setMessageText(`${oponent.name}のこうげき！`);
        }

        // 敵の攻撃フェーズ
        const oponentsAttack = () => {
            // ダメージ計算
            const caluculatedDamage = Math.floor(tempOponent.attack / tempPlayer.deffenceUpRate);
            setMessageText(`${tempPlayer.name}に${caluculatedDamage}のダメージ！`);

            // 攻撃を受けた後のHP計算
            const afterHp = tempPlayer.hp - caluculatedDamage;
            if (afterHp > 0) {
                tempPlayer.hp = afterHp;
                setPlayer(tempPlayer);
            } else {
                tempPlayer.hp = 0;
                setPlayer(tempPlayer);
                throw new Error('PLAYER_DEAD');
            }
        }

        const handleError = (err) => {
            switch (err.message) {
                // 敵が倒れたとき、バトル終了
                case 'OPONENT_DEAD':
                    setMessageText(`${oponent.name}をたおした！`);
                    setStatus(STATUS.BATTLE_END);
                    break;
                // プレイヤーが倒れたとき、バトル終了
                case 'PLAYER_DEAD':
                    setMessageText(`${player.name}はたおれてしまった！`);
                    setStatus(STATUS.BATTLE_END);
                    break;
                // その他のエラー
                default:
                    alert(err);
                    break;
            }
        }
    };

    // 未開発のボタンをクリックしたときの処理
    const onClickNotFound = () => {
        setMessageText('この機能はまだできていないのじゃ！');
        setStatus(STATUS.NOT_FOUND);
    }

    // メインコマンド選択に戻る
    const goToMainCommand = () => {
        setStatus(STATUS.SELECT_MAIN_COMMAND);
        setMessageText("どうする？");
    }

    const onClickCommands = {
        onClickFitght,
        onClickReturnMain,
        onClickSkill,
        onClickNotFound,
        onSelectSkill
    };

    return (
        <div style={battleSceneStyle.battleScene} onClick={onClickHandler}>
            <Oponent oponent={oponent} />
            <Player player={player} />
            <Message status={status} onClickCommands={onClickCommands} skills={player.skills} selectedSkillIndex={selectedSkillIndex} messageText={messageText} />
        </div>
    );
}

const battleSceneStyle = {
    battleScene: {
        width: '100%',
        height: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
}

export default BattleScene;