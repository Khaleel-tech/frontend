import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Mail, MoveToInbox } from "@mui/icons-material";
import { useRouter } from "next/navigation";

function DrawerList({ anchor }: { anchor: string }) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation("/bookRide")}>
            <ListItemIcon>
              <MoveToInbox />
            </ListItemIcon>
            <ListItemText primary="Book Your Ride" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation("/myRides")}>
            <ListItemIcon>
              <MoveToInbox />
            </ListItemIcon>
            <ListItemText primary="Your Ride" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export default DrawerList;
