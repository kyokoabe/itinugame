impoort React, { Children, useState } from 'react';
import { STATUS } from "../../constants/battle-constants";

// メッセージコンポーネント
const Message = (props) => {
    const { status, messageText } = props;

    return (
        <div style={style.messageContainer}>
            <MainMessage>{messageText}</MainMessage>
            {status === STATUS.SELECT_MAIN_COMMAND && <MainCommandModal {...props} />}
            {status === STATUS.SELECT_SKILL_COMMAND && <SkillCommandModal {...props} />}
        </div>
    );
}

// 通常のメッセージを表示
const MainMessage = (props) => {
    return (
        <div style={{ ...style.normalMessageContainer, ...style.border }}>
            <p style={{ whiteSpace: 'preWrap' }}>{props.children}</p>
        </div>
    )
}

// メインコマンドを表示
const MainCommandModal = (props) => {
    const { onClickCommands } = props;
    const { onClickFitght, onClickNotFound } = onClickCommands;

    return (<div style={{ ...style.mainCommandContainer, ...style.border }}>
        <MainCommand clickEvent={onClickFitght}>たたかう</MainCommand>
        <MainCommand clickEvent={onClickNotFound}>どうぐ</MainCommand>
        <MainCommand clickEvent={onClickNotFound}>リアモン</MainCommand>
        <MainCommand clickEvent={onClickNotFound}>にげる</MainCommand>
    </div>)
}

const MainCommand = (props) => {
    const { clickEvent, children } = props;
    return (<Command style={style.mainCommandText} onClick={clickEvent}>{children}</Command>);
}

// わざコマンドを表示
const SkillCommandModal = (props) => {
    const { skills, onClickCommands, selectedSkillIndex } = props;
    const { onClickReturnMain, onClickSkill, onSelectSkill } = onClickCommands;
    const skill = skills[selectedSkillIndex];

    return (<>
        <div style={{ ...style.skillComandContainer, ...style.border }}>
            {skills.map((skill, index) =>
                <SkillCommand clickEvent={() => onClickSkill(index)} key={index} style={{ fontWeight: index == selectedSkillIndex ? 'bold' : 'normal' }} >{skill.name}</SkillCommand>
            )}
            <SkillCommand clickEvent={onClickReturnMain}>もどる↩︎</SkillCommand>
        </div>
        {selectedSkillIndex !== null && (
            <div style={{ ...style.skillDetailContainer, ...style.border }}>
                <span style={style.skillPPText}>{skill.pp}/{skill.maxPp}</span>
                <span>{skill.type}わざ</span>
                <Command style={style.skillSelectButton} onClick={onSelectSkill}>けってい</Command>
            </div>
        )}
    </>)
}

const SkillCommand = (props) => {
    const { clickEvent, children } = props;
    return (<Command style={{ ...props.style, ...style.skillCommandText }} onClick={clickEvent}>{children}</Command>);
}

// コマンドの表示
const Command = (props) => {
    const { children, style } = props;
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (<span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props} style={{ opacity: isHovering ? 0.6 : 1, cursor: 'pointer', ...style }}>{children}</span>);
}

const style = {
    border: {
        border: '2px solid black',
        borderRadius: 4,
        backgroundColor: 'white',
    },
    messageContainer: {
        position: 'relative',
    },
    normalMessageContainer: {
        witdh: '100%',
        height: 80,
        padding: 12,
    },
    mainCommandContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 200,
        height: 80,
        padding: 12,
        display: 'flex',
        flexWrap: 'wrap',
    },
    mainCommandText: {
        width: '50%',
    },
    skillCommandText: {
        width: '100%',
        "&:hover": {
            background: "#efefef"
        },
    },
    skillComandContainer: {
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        padding: 12,
        gap: 4,
        width: '50%',
    },
    skillDetailContainer: {
        width: '50%',
        position: 'absolute',
        padding: 12,
        gap: 4,
        bottom: 0,
        right: 0,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    skillPPText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    skillSelectButton: {
        fontWeight: 'bold',
    }
}

export default Message;