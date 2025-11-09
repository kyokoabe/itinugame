const Name = (props) => {
    const { name, level, textAlign } = props;
    return (
        <span style={{ textAlign: textAlign }}>{name}：L{level}</span>
    );
}

export default Name;