import { StyleSheet } from 'react-native';
import React from 'react';
import * as Dropdownmenu from 'zeego/dropdown-menu';
import RoundBtn from './RoundBtn';
import { router } from 'expo-router';

const Dropdown = () => {
    const src = () => {
        router.push('/signup');
    };

    return (
        <Dropdownmenu.Root>
            <Dropdownmenu.Trigger>
                <RoundBtn icon={'ellipsis-horizontal'} text={'More'} />
            </Dropdownmenu.Trigger>

            <Dropdownmenu.Content>
                <Dropdownmenu.Item key="Addnewaccount" onSelect={src}>
                    <Dropdownmenu.ItemTitle>Add new account</Dropdownmenu.ItemTitle>
                    <Dropdownmenu.ItemIcon ios={{ name: 'plus.rectangle.on.folder.fill' }} />
                </Dropdownmenu.Item>
            </Dropdownmenu.Content>
        </Dropdownmenu.Root>
    );
};

export default Dropdown;

const styles = StyleSheet.create({});
