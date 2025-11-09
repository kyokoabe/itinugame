const Image = (props) => {
    const { monster, size, children } = props;
    return (
        <p style={{ opacity: monster.hp === 0 ? 0 : 1, fontSize: size, ...style.image, }}>{children}</p>
    );
}

const style = {
    image: {
        transition: 'opacity 0.5s',
    },
}

export default Image;