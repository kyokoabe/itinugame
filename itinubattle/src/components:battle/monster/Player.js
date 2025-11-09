import Name from './monster/Name';
import Hp from './monster/Hp';
import Image from './monster/Image';

const Player = (props) => {
    const { player } = props;
    return (
        <div style={style.playerContainer}>
            <Image monster={player} size={100}>🧑‍💻</Image>
            <div style={style.infoContainer}>
                <Name name={player.name} level={player.level} textAlign='left' />
                <Hp hp={player.hp} maxHp={player.maxHp} fontSize={18} />
            </div>
        </div>
    );
}

const style = {
    infoContainer: {
        witdh: '100%',
        height: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
        paddingBottom: '12px',
        paddingRight: '24px',
        borderBottom: '2px solid #000',
        borderRight: '2px solid #000'
    },
    playerContainer: {
        display: 'flex',
        justifyContent: 'start',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
    },
}

export default Player;