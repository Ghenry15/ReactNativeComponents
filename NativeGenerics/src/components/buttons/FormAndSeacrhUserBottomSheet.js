import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Image, ScrollView, Alert, SafeAreaView, Platform, FlatList } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import SelectPicker from 'react-native-form-select-picker';
import Icon from 'react-native-vector-icons/Ionicons'
import { Avatar, Divider, ListItem } from 'react-native-elements'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import AuthContext from '../../context/authContext/AuthContext';
import { t } from 'i18next';
import { MODALITY } from '../../constants/modality';
import { DURATION } from '../../constants/duration';
import { CURRENCY } from '../../constants/currency';
import { saveSubscriptionInstant } from '../../services/subscriptionsService';
import { getAddress } from '../../services/addressService'
import BackgroundGradient from '../../components/BackgroundGradient';
import { appColors, styleGlobal } from '../../styles'
import { getUsers } from '../../services/userServices';

const list = [
    {
        id: 49,
        name: 'Leandro Gordillo',
        avatar: 'https://i.pravatar.cc/300',
        email: 'lean@gmail.com'
    },
    {
        id: 42,
        name: 'Coco',
        avatar: 'https://i.pravatar.cc/305',
        email: 'coco@gmail.com'
    },
    {
        id: 156,
        name: 'Maximiliano',
        avatar: 'https://i.pravatar.cc/301',
        email: 'maxi@gmail.com'
    },
    {
        id: 132,
        name: 'Eze',
        avatar: 'https://i.pravatar.cc/401',
        email: 'eze@gmail.com'
    },
]

export const MeetingInstantScreen = ({ navigation }) => {
    const { user, refreshUserData } = useContext(AuthContext);
    const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm()

    const bottomSheetRef = useRef < BottomSheet > (null);
    const [indexBottom, setIndexBottom] = useState(-1)
    const snapPoints = useMemo(() => [25, 300], [])

    const [isLoadingBtn, setLoadingBtn] = useState(false);
    const [isVisibleSheet, setIsVisibleSheet] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(0);
    const [selectedDuration, setSelectedDuration] = useState(30);
    const [selectedCurrency, setSelectedCurrency] = useState(0);
    const [isModality, setIsModality] = useState();
    const [isAddres, setisAddres] = useState(1);
    const [addressUser, setAddressUser] = useState();
    const [selectedAddress, setSelectedAddress] = useState()
    const [listUsers, setListUsers] = useState([])
    const [userId, setUserId] = useState()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='flash-sharp' size={25} color={appColors.black} />
                        <Icon name='flash-sharp' size={20} color={appColors.black} style={{ padding: 5, marginTop: -10, marginLeft: -15, height: 35, width: 35 }} />
                        <Text style={{ ...styles.txtInput, fontSize: 22 }}>{t('reservation.hire_title_instant')}</Text>
                    </View>
                )
            }
        })
    }, [])

    const getSearchUser = async (freeText) => {
        let query = (freeText) ? `freeText=${freeText}` : '';
        try {
            const { data } = await getUsers(query)

            if (data && data.length) {
                setListUsers(data.data)
            }
        } catch (error) {
            console.log('SEARCH USERS MEETING - API USER - ERROR', error)
        }
    }
    const getAddressById = async () => {
        try {
            // (userId) ? userId : user?.id
            const { data } = await getAddress(user?.id)
            if (data && data.length) {
                setSelectedAddress(data[0].id)
                console.log(data)
            }
            setAddressUser(data)
        } catch (error) {
            console.log('MEETING INSTANT SCREEN - API ADDRESS - ERROR', error)
        }
    }
    const handleUserCheck = (idUser) => {
        setIndexBottom(0); setUserId(idUser); setisAddres(2);
    }
    const handleCreateMeeting = () => {
        const payload = {
            "email": getValues('email'),
            "duration": selectedDuration,
            "price": getValues('price'),
            "currency": selectedCurrency,
            "modality": isModality,
            "address": (addressUser) ? addressUser : (getValues('address')) ? getValues('address') : null,
            "payment": selectedPayment,
            "id": Number(user.id),
        }

        // const { data } = await saveSubscriptionInstant(payload);

        console.log(payload);
        // navigation.navigate("ConfirmationInstantScreen", { avatar: user.avatar });
    }

    useEffect(() => {
        getSearchUser(getValues('find_user'))
    }, [getValues('find_user')])

    useEffect(() => {
        if (user) getAddressById()
    }, [userId])

    return (
        <SafeAreaView style={{ ...styles.area }}>
            <View style={{ ...styles.container }}>
                <ScrollView>
                    <View style={{ ...styles.col }}>
                        <View style={{ ...styleGlobal.shadow, ...styles.row }}>
                            <Text style={styles.txtInput}>{t("reservation.for_input_email")}</Text>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: false, }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={{ ...styleGlobal.shadow, ...styles.input, width: '100%', fontSize: 18 }}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t('reservation.placheholder_email')}
                                        placeholderTextColor={appColors.tabs_label}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ ...styles.row }}>
                            <Text style={styles.txtInput}>Duración y precio</Text>
                            <View style={{ ...styles.rowSelects }}>
                                <Text style={{ ...styles.placeHolder }}>{t("reservation.duration")}</Text>
                                <View style={{ ...styles.containerSelect, width: '75%', }}>
                                    <SelectPicker
                                        onSelectedStyle={{ color: appColors.tabs_label, textAlign: 'right', marginRight: 30, fontSize: 18 }}
                                        placeholderStyle={{ color: appColors.tabs_label, textAlign: 'right', marginRight: 30, fontSize: 18 }}
                                        doneButtonText='Cerrar'
                                        placeholderTextColor={appColors.tabs_label}
                                        placeholder={selectedDuration}
                                        style={{ ...styleGlobal.shadow, ...styles.input, ...styles.dropDown, }}
                                        selected={selectedDuration}
                                        onValueChange={(value) => { setSelectedDuration(value); }}
                                    >

                                        {DURATION.map((val, index) => (
                                            <SelectPicker.Item label={`${val.duration}  ${t('reservation.minutes')}`} value={val.duration} key={`${val.id}-${index}`} />
                                        ))}
                                    </SelectPicker>
                                    <View style={{ ...styles.containerIconChevron }}>
                                        <Icon name='chevron-down-outline' size={25} color={appColors.pink} />
                                    </View>
                                </View>
                            </View>

                            <View style={{ ...styles.rowSelects }}>
                                <Text style={{ ...styleGlobal.shadow, ...styles.placeHolder, }}>{t("reservation.price")}</Text>
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: false, }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={{ ...styleGlobal.shadow, ...styles.input, textAlign: 'right', width: '40%', }}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder={t('reservation.price_example')}
                                            placeholderTextColor={appColors.tabs_label}
                                        />
                                    )}
                                />
                                <View style={{ ...styles.containerSelect, width: '25%', }}>
                                    <SelectPicker
                                        onSelectedStyle={{ color: appColors.tabs_label, textAlign: 'center', marginRight: 20, fontSize: 18 }}
                                        placeholderStyle={{ color: appColors.tabs_label, textAlign: 'center', marginRight: 20, fontSize: 18 }}
                                        doneButtonText='Cerrar'
                                        placeholderTextColor={appColors.tabs_label}
                                        placeholder={`${selectedCurrency ? selectedCurrency : 'ARS'}`}
                                        style={{ ...styleGlobal.shadow, ...styles.input, ...styles.dropDown }}
                                        selected={selectedCurrency}
                                        onValueChange={(value) => { setSelectedCurrency(value); }}
                                    >
                                        {CURRENCY.map((val, index) => (
                                            <SelectPicker.Item label={val.currency} value={val.currency} key={`${val.id}-${index}`} />
                                        ))}
                                    </SelectPicker>
                                    <View style={{ ...styles.containerIconChevron }}>
                                        <Icon name='chevron-down-outline' size={25} color={appColors.pink} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* MODALIDAD - DOMICILIOS */}
                        {/* <View style={{ ...styles.row }}>
                            <Text style={styles.txtInput}>{t("reservation.type_service")}</Text>
                            <View style={{ ...styles.containerSelect }}>
                                <SelectPicker
                                    onSelectedStyle={{ color: appColors.black, }}
                                    placeholderStyle={{ color: appColors.tabs_label, }}
                                    doneButtonText='Cerrar'
                                    placeholderTextColor={appColors.tabs_label}
                                    placeholder={selectedModality}
                                    style={{ ...styleGlobal.shadow, ...styles.inputSelect, ...styles.dropDown }}
                                    selected={selectedModality}
                                    onValueChange={(value) => { setSelectedModality(value); }}
                                >
                                    {MODALITY.map((val, index) => (
                                        <SelectPicker.Item label={val.label} value={val.label} key={`${val.id}-${index}`} />
                                    ))}
                                </SelectPicker>
                                <View style={{ ...styles.containerIconChevron }}>
                                    <Icon name='chevron-down-outline' size={25} color={appColors.tabs_label} />
                                </View>
                            </View>
                        </View> */}
                        <View style={{ ...styles.row }}>
                            <Text style={styles.txtInput}>Modalidad</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <TouchableOpacity style={{ ...styleGlobal.shadow, ...styles.buttonModality, backgroundColor: isModality === 1 ? appColors.pink : appColors.white }} onPress={() => setIsModality(1)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5, marginHorizontal: 20, opacity: isModality != 1 ? 0.5 : 1 }}>
                                        {
                                            isModality === 1
                                                ? (<Image source={require('../../assets/globeWhite.png')} style={{ width: 20, height: 20, borderRadius: 15, }} />)
                                                : (<Image source={require('../../assets/globeGrey.png')} style={{ width: 20, height: 20, borderRadius: 15, }} />)
                                        }
                                        <Text style={{ color: isModality === 1 ? appColors.white : appColors.tabs_label, fontFamily: 'DMSans-Bold', fontSize: 17, marginLeft: 10 }}>{t('reservation.virtual')}</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity style={{ ...styleGlobal.shadow, ...styles.buttonModality, backgroundColor: isModality === 2 ? appColors.pink : appColors.white, }} onPress={() => setIsModality(2)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5, marginHorizontal: 20, opacity: isModality != 2 ? 0.5 : 1 }}>
                                        {
                                            isModality === 2
                                                ? (<Image source={require('../../assets/inPersonWhite.png')} style={{ width: 20, height: 20, borderRadius: 15, }} />)
                                                : (<Image source={require('../../assets/inPersonGrey.png')} style={{ width: 20, height: 20, borderRadius: 15, }} />)
                                        }
                                        <Text style={{ color: isModality === 2 ? appColors.white : appColors.tabs_label, fontFamily: 'DMSans-Bold', fontSize: 17, marginLeft: 10 }}>{t('reservation.in_person')}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                        {
                            isModality === 2
                            &&
                            (
                                isAddres != 3
                                    ? (
                                        <View>
                                            <View style={{ marginBottom: 10 }}>
                                                {/* <Divider width={1} style={{ marginHorizontal: 10, marginVertical: 15 }} color={appColors.grey} /> */}
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                    <TouchableOpacity
                                                        style={{ ...styleGlobal.shadow, ...styles.buttonModality, backgroundColor: isAddres === 1 ? appColors.pink : appColors.white }}
                                                        onPress={() => setisAddres(1)}>
                                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10, marginHorizontal: 30, }}>
                                                            <Text style={{ color: isAddres === 1 ? appColors.white : appColors.tabs_label, fontFamily: 'DMSans-Bold', fontSize: 13, }}>{t('reservation.address_select_me')}</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={{ ...styleGlobal.shadow, ...styles.buttonModality, backgroundColor: isAddres === 2 ? appColors.pink : appColors.white }}
                                                        onPress={() => { setisAddres(2); setIndexBottom(1) }}>
                                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                                            <Text style={{ color: isAddres === 2 ? appColors.white : appColors.tabs_label, fontFamily: 'DMSans-Bold', fontSize: 13 }}>{t('reservation.address_select_user')}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={{ ...styles.containerSelect, }}>
                                                <SelectPicker
                                                    onSelectedStyle={{ color: appColors.tabs_label, textAlign: 'center', marginRight: 25 }}
                                                    placeholderStyle={{ color: appColors.tabs_label, textAlign: 'center', marginRight: 25 }}
                                                    style={{ ...styleGlobal.shadow, ...styles.input, ...styles.dropDown }}
                                                    onValueChange={(value) => {
                                                        setSelectedAddress(value);
                                                    }}
                                                    selected={selectedAddress}
                                                >
                                                    {addressUser.map((val, index) => (
                                                        <SelectPicker.Item label={`(${val.alias}) - ${val.street} ${val.streetNumber}, ${val.city}, ${val.country.name}`} value={val.id} key={`${val.id}`} />
                                                    ))}
                                                </SelectPicker>
                                                <View style={{ ...styles.containerIconChevron }}>
                                                    <Icon name='chevron-down-outline' size={25} color={appColors.pink} />
                                                </View>
                                            </View>
                                        </View>
                                    ) :
                                    (
                                        <View style={{ ...styles.row }}>
                                            <Controller
                                                name="addres"
                                                control={control}
                                                rules={{ required: false, }}
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <TextInput
                                                        style={{ ...styleGlobal.shadow, ...styles.input, width: '100%' }}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        placeholder={t('reservation.manuality_addres_placeholder')}
                                                        placeholderTextColor={appColors.tabs_label}
                                                    />
                                                )}
                                            />
                                        </View>
                                    )
                            )
                        }


                        <View style={{ ...styles.row, marginVertical: 15 }}>
                            <Text style={styles.placeHolder}>{t("reservation.hire_title3")}</Text>
                            <View style={{ ...styles.rowSelects, marginVertical: 15 }}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ ...styleGlobal.shadow, width: 110, height: 45, backgroundColor: appColors.white, padding: 10, borderRadius: 15 }}>
                                        <Image source={require('../../assets/paymentMP.png')} style={{ width: '100%', height: '100%', }} />
                                    </View>
                                    <View style={{ ...styles.rowCheckbox }}>
                                        <CheckBox
                                            boxType={'square'}
                                            value={selectedPayment === 1 ? true : false}
                                            onValueChange={() => setSelectedPayment(1)}
                                            style={{ ...styles.check }}
                                            tintColors={{ true: appColors.pink, false: appColors.grays }}
                                            onFillColor={appColors.pink}
                                            onCheckColor={appColors.white}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ ...styleGlobal.shadow, width: 110, height: 45, backgroundColor: appColors.white, padding: 10, borderRadius: 15 }}>
                                        <Image source={require('../../assets/paypal.png')} style={{ width: '100%', height: '100%', }} />
                                    </View>
                                    <View style={{ ...styles.rowCheckbox }}>
                                        <CheckBox
                                            boxType={'square'}
                                            value={selectedPayment === 2 ? true : false}
                                            onValueChange={() => setSelectedPayment(2)}
                                            style={{ ...styles.check }}
                                            tintColors={{ true: appColors.pink, false: appColors.grays }}
                                            onFillColor={appColors.pink}
                                            onCheckColor={appColors.white}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ ...styleGlobal.shadow, width: 110, height: 45, backgroundColor: appColors.white, padding: 5, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ ...styles.rowSelects }}>
                                            <Text style={styles.txtBtnCash}>Efectivo</Text>
                                            <Image source={require('../../assets/cash.png')} style={{ width: '35%', height: '100%', }} />
                                        </View>
                                    </View>
                                    <View style={{ ...styles.rowCheckbox }}>
                                        <CheckBox
                                            boxType={'square'}
                                            value={selectedPayment === 3 ? true : false}
                                            onValueChange={() => setSelectedPayment(3)}
                                            style={{ ...styles.check }}
                                            tintColors={{ true: appColors.pink, false: appColors.grays }}
                                            onFillColor={appColors.pink}
                                            onCheckColor={appColors.white}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <BackgroundGradient style={{ ...styles.gradient }} >
                            <TouchableOpacity onPress={handleCreateMeeting}>
                                <View style={{ ...styles.containerButton }}>
                                    {isLoadingBtn ? <ActivityIndicator size={15} color="white" /> : (
                                        <>
                                            <Text style={{ ...styles.txtButton }}>{t('reservation.button_meeting_instant').toUpperCase()}</Text>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Icon
                                                    name='chevron-forward'
                                                    size={18}
                                                    color={appColors.white}
                                                />
                                            </View>
                                        </>

                                    )}
                                </View>
                            </TouchableOpacity>
                        </BackgroundGradient>
                    </View>
                </ScrollView>
                <BottomSheet
                    snapPoints={snapPoints}
                    style={{ backgroundColor: appColors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                    animateOnMount={true}
                    index={indexBottom}
                    onChange={() => {
                        if (indexBottom === 0) {
                            setIndexBottom(-1)
                        } else {
                            setIndexBottom(1)
                        }
                    }}
                >
                    <View style={{ ...styles.sheetContainer }}>
                        <View style={{ ...styles.sheetBox, }}>
                            <View style={{ ...styleGlobal.shadow, ...styles.containerInputSearch, alignItems: 'center' }}>
                                <View style={{ ...styles.containerIconSearch }}>
                                    <Image
                                        source={require('../../assets/search.png')}
                                        style={{ ...styles.imageIconSearch }}
                                    />
                                </View>
                                <Controller
                                    name="find_user"
                                    control={control}
                                    render={({ field: { onBlur, value, onChange } }) => (
                                        <TextInput
                                            color
                                            style={{ ...styles.textInputSearch, }}
                                            placeholder='Buscar usuario'
                                            placeholderTextColor={appColors.tabs_label}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                            </View>
                            <View style={{ ...styleGlobal.shadow, ...styles.containerInputSearch, marginTop: 15 }}>
                                <Text style={{ ...styles.txtInput, fontSize: 16, paddingVertical: 10, }}>{t("reservation.manuality_addres")}</Text>
                                <View style={{ width: 30, height: 30 }}>
                                    <CheckBox
                                        boxType={'square'}
                                        value={isAddres === 3 ? true : false}
                                        onValueChange={() => { setisAddres(3); setIndexBottom(0); }}
                                        style={{ width: 30, height: 30, marginLeft: 15 }}
                                        tintColors={{ true: appColors.pink, false: appColors.grays }}
                                        onFillColor={appColors.pink}
                                        onCheckColor={appColors.white}
                                    />
                                </View>
                            </View>
                            {/* <Divider key={1} width={1.5} style={{ paddingVertical: 5 }} color={appColors.tabs_label} /> */}
                            <BottomSheetFlatList
                                data={list}
                                keyExtractor={(i) => i}
                                renderItem={(item) => renderUsers(item, handleUserCheck)}
                                contentContainerStyle={{ backgroundColor: appColors.white }}
                                style={{ marginVertical: 10 }}
                            />
                        </View>
                    </View>
                </BottomSheet>
            </View>
        </SafeAreaView >
    )
}

const renderUsers = ({ item }, handleUserCheck) => {
    return (
        // style={{borderBottomWidth:1,borderColor:appColors.tabs_label}}
        <View >
            <TouchableOpacity onPress={() => handleUserCheck(item.id)}>
                <View style={{ ...styles.content }}>
                    <Image source={{ uri: `${item.avatar}` }} style={{ width: 50, height: 50, borderRadius: 50, }} />
                    <Text style={{ fontFamily: 'DMSans-Bold', fontSize: 18, marginLeft: 15 }}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: appColors.background,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    col: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    row: {
        marginVertical: 10,
    },
    rowSelects: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowTxt: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtInput: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: appColors.black,
        textAlign: 'justify',
        marginLeft: 3,
        marginBottom: 10
    },
    txtBtnCash: {
        fontSize: 14,
        fontFamily: 'DMSans-Bold',
        color: appColors.black,
        textAlign: 'left',
    },
    placeHolder: {
        fontSize: 16,
        fontFamily: 'DMSans-Bold',
        color: appColors.tabs_label,
        textAlign: 'left',
    },
    containerButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    txtButton: {
        color: appColors.white,
        fontSize: 16,
        fontFamily: 'DMSans-Bold'
    },
    gradient: {
        width: 320,
        height: 51,
        borderRadius: 30,
    },
    containerSelect: {
        marginVertical: 10,
        justifyContent: 'center',
        color: appColors.tabs_label,
    },
    input: {
        width: 160,
        height: 50,
        padding: 10,
        backgroundColor: appColors.white,
        color: appColors.black,
        borderRadius: 20,
        fontSize: 18,
    },
    dropDown: {
        width: '100%',
        height: 48,
        justifyContent: 'center',
        backgroundColor: appColors.white,
        borderRadius: 20,
    },
    containerIconChevron: {
        position: 'absolute',
        right: 10,
        marginLeft: 10,
    },
    buttonModality: {
        borderRadius: 20,
        justifyContent: 'center',
        height: 50,
        width: '46%',
    },
    rowCheckbox: {
        ...styleGlobal.shadow,
        width: 30,
        height: 30,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 15,
    },
    check: {
        width: 30,
        height: 30,
    },
    sheetContainer: {
        flex: 1,
        backgroundColor: appColors.white,
        borderRadius: 15,
    },
    sheetBox: {
        flex: 1,
        paddingHorizontal: 10,
        // paddingVertical:5,
    },
    sheetTxtRows: {
        textAlign: 'center',
        color: appColors.black,
        fontSize: 20,
        fontFamily: 'DMSans-bold'
    },
    containerInputSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: appColors.white,
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    textInputSearch: {
        paddingHorizontal: 20,
        paddingVertical: (Platform.OS === 'ios') ? 10 : 10,
    },
    containerIconSearch: {
        justifyContent: 'center',
    },
    imageIconSearch: {
        width: 20,
        height: 20,
        borderRadius: 15,
    },
    rowUsers: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        // paddingHorizontal: 10,
    },
})
