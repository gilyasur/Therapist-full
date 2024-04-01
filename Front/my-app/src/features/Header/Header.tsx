import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from '@mantine/core';
import {
  Container,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconChevronDown,  IconSettings } from '@tabler/icons-react';
import classes from './Header.module.css';

import '@mantine/core/styles.css';

import logoImage from '../../images/DashBoardLogo.jpeg';
import { logOut, selectFirstName, selectLastName, selectProfileImage, selectUserEmail } from '../Presite/login/loginSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { selectEditedImageProfile } from '../Profile/profileSlice';

export function Header() {
  const dispatch = useDispatch<ThunkDispatch<any, void, AnyAction>>();
  const userFirstName = useSelector(selectFirstName);
  const userLastName = useSelector(selectLastName);
  const userEmail = useSelector(selectUserEmail);
  const profile_image= useSelector(selectProfileImage)
  const user = {
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    profile_image:profile_image,
  };
  const tabs = ['Profile', 'Patients', 'Appointments',  'Reports',];
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const navigate = useNavigate();
  const editedProfileImage: string | null = useSelector(selectEditedImageProfile)?.editedprofileImage ?? null;
  const handleTabChange = (value:any) => {
    navigate(`/App/Dashboard/${value.toLowerCase()}`);
  };

  const handleProfileClick = () => {
    navigate('/App/profile');
  };
  const handleeditProfileClick = () => {
    navigate('/App/editProfile'); 
    };
  const handleLogOut =()=> {
    dispatch(logOut())
    navigate('/')

    
  }

  const [updatedProfileImage, setUpdatedProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Update the profile image whenever editedProfileImage changes
    setUpdatedProfileImage(editedProfileImage);

    
  }, [editedProfileImage]);
 
  

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md" >
        <Group gap="xs" justify="space-between">
          <div>
          <img src={logoImage} alt="Logo" style={{ height: '90px', borderRadius: '50%', border: '1px solid #94b6bf' }} />
       
          </div>
          <div className={classes.dmSansCustom}>Therapist DashBoard App</div>
         
          <Burger
  opened={drawerOpened}
  onClick={() => setDrawerOpened((o) => !o)}
  hiddenFrom="sm"
  size="sm"
/>  
<Drawer
  opened={drawerOpened}
  onClose={() => setDrawerOpened(false)}
  position="left"
  withCloseButton={false}
  size="xs"
>
<Tabs
  defaultValue="Profile"
  variant="outline"
  orientation="vertical"
  onChange={handleTabChange} 
>
    <Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Tab key={tab} value={tab}>
          {tab}
        </Tabs.Tab>
      ))}
    </Tabs.List>
  </Tabs>
</Drawer>
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <div className={classes.user} style={{border:"10px"}}>
              <img
        src={updatedProfileImage ? `https://theradash.onrender.com${updatedProfileImage}` : `https://theradash.onrender.com${profile_image}`}
        alt="Profile"
        style={{
          width: '50px',
          height: 'auto',
          borderRadius: '50%',
          border: '0.5px solid #94b6bf',
        }}
      />

                <Group justify="space-between">
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user.firstName} {user.lastName}
                  </Text>
                  
                  <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                </Group>
                <br/>

              </div>
            </Menu.Target>
            <Menu.Dropdown>
            <Menu.Item
            onClick={handleProfileClick}
               leftSection={
                <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              >


                Profile
              </Menu.Item>
              <Menu.Item
            onClick={handleeditProfileClick}
               leftSection={
                <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              >


               Edit Profile
              </Menu.Item>
              <Menu.Item
              onClick={handleLogOut}
                leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              >
                Logout
              </Menu.Item>

              <Menu.Divider />
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue="Profile"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
          onChange={handleTabChange}
        >
          <Tabs.List>
            {tabs.map((tab) => (
              <Link
                to={`/App/Dashboard/${tab.toLowerCase()}`}
                key={tab}
                className={classes.tabLink}
              >
                <Tabs.Tab value={tab}>{tab}</Tabs.Tab>
              </Link>
            ))}
          </Tabs.List>
        </Tabs>
      </Container>
      
    </div>
  );
}
