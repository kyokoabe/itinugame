import Hp from './monster/Hp';
import Name from './monster/Name';
import Image from './monster/Image';

const Oponent = (props) => {
    const { oponent } = props;
    return (
        <div style={style.oponentContainer}>
            <div style={style.infoContainer}>
                <Name name={oponent.name} level={oponent.level} textAlign='right' />
                <Hp hp={oponent.hp} maxHp={oponent.maxHp} />
            </div>
            <Image monster={oponent} size={60}>😈</Image>
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
        paddingLeft: '24px',
        borderBottom: '2px solid #000',
        borderLeft: '2px solid #000'
    },
    oponentContainer: {
        display: 'flex',
        justifyContent: 'end',
        justifyContent: 'space-between',
        padding: '24px',
    },
}

export default Oponent;