const Hp = (props) => {
    const { hp, maxHp, fontSize } = props;

    const hpColor = () => {
        if (hp > maxHp * 0.5) {
            return 'green';
        } else if (hp > maxHp * 0.2) {
            return 'orange';
        } else {
            return 'red';
        }
    }
    return (
        <div>
            <span>HP</span>
            <span style={{ fontSize: fontSize ? fontSize : 16, ...style.hpString }}><span style={{ color: hpColor() }}>{hp}</span> / {maxHp}</span>
        </div>)

}

const style = {
    hpString: {
        fontWeight: 'bold',
        marginLeft: '4px',
    }
}

export default Hp;