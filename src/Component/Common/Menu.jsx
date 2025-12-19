import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagCircleIcon from '@mui/icons-material/FlagCircle';

export default function BasicMenu(props) {
    const { handleMenuItems } = props;
    const [anchorPosition, setAnchorPosition] = React.useState(null);
    const open = Boolean(anchorPosition);

    const handleClick = (event) => {
        setAnchorPosition({
            top: event.clientY,  // Use cursor's Y position
            left: event.clientX, // Use cursor's X position
        });
    };



    const handleClose = (event) => {
        setAnchorPosition(null);
    };

    const handleMenuItemClick = (option) => {
        handleMenuItems(option)
        setAnchorPosition(null);
    }

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ outline: "none !important" }}
            >
                <MoreVertIcon />
            </Button>
            <Menu
                id="basic-menu"
                open={open}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition ? { top: anchorPosition.top, left: anchorPosition.left } : undefined}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => handleMenuItemClick("edit")} sx={{ alignItems: "center", gap: "10px" }}><ModeEditIcon /> Edit</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("delete")} sx={{ alignItems: "center", gap: "10px" }}><DeleteIcon /> Delete</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("report")} sx={{ alignItems: "center", gap: "10px" }}><FlagCircleIcon /> Report</MenuItem>
            </Menu>
        </div>
    );
}
