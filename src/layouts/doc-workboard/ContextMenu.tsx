import React from 'react';


interface MenuItem {
    name: string;
    icon: any;
    action: () => void;
}

interface ContextMenuProps {
    top: number;
    left: number;
    items: MenuItem[];
    onClose: () => void;
    contextMenuVisible: boolean;
    setContextMenuVisible: any;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ top, left, items, onClose, setContextMenuVisible }) => {



    const menuStyle: React.CSSProperties = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        backgroundColor: '#6c757d',
        boxShadow: '1px 1px 2px #007bff',
        zIndex: 1000,
        padding: '12px 12px',
        border: 'solid 1px #007bff',
        color: 'white',
        borderRadius: 6
    };

    const listStyle: React.CSSProperties = {
        marginBottom: 4,
        width: 175,
        height: 35,
        cursor: "pointer",
        fontSize: 16,
        color: "white", // Default text color
        backgroundColor: "#6c757d", // Default background color
        borderRadius: 6,
        transition: "background-color 0.3s", // Smooth transition
    };

    function handleMouseEnter(e: React.MouseEvent<HTMLLIElement>) {
        e.currentTarget.style.backgroundColor = "#384C6D"; // Change background color on hover
        e.currentTarget.style.color = "white"; // Change text color on hover
    }

    function handleMouseLeave(e: React.MouseEvent<HTMLLIElement>) {
        e.currentTarget.style.backgroundColor = "#6c757d"; // Revert to default background color
        e.currentTarget.style.color = "white"; // Revert to default text color
    }

    const handleClick = (action: () => void) => {
        onClose();
        action();
    };

    let touchTimeout: NodeJS.Timeout;

    const handleTouchStart = () => {
        touchTimeout = setTimeout(() => {
            setContextMenuVisible(true)
        }, 1000); // Adjust the duration for your desired long-press duration
    };

    const handleTouchEnd = () => {
        clearTimeout(touchTimeout);
    };


    return (
        <div style={menuStyle} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {items.map((item, index) => (
                    <li
                        onClick={() => handleClick(item.action)}
                        key={index}
                        style={listStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span style={{ paddingRight: 12 }}>{item.icon}</span>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};



export default ContextMenu;
