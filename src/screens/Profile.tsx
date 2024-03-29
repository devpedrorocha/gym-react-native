import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from 'native-base'
import { Controller, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { api } from '@services/api';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UsePhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
    confirm_password: yup.string().nullable().transform((value) => !!value ? value : null).oneOf([yup.ref('password')], ' A confirmação de senha não confere.').when('password', {
        is: (Field: any) => Field,
        then: (schema) =>
            schema.nullable().required('Informe a confirmação da senha.').transform((value) => !!value ? value : null)
    })
})

export function Profile() {


    const [isLoading, setIsLoading] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false)

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema)
    })

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true)
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            })
            if (photoSelected.canceled) {
                return;
            }
            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 3) {
                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 3MB',
                        placement: 'top',
                        bgColor: 'red.500'
                    })

                }
                const fileExetension = photoSelected.assets[0].uri.split('.').pop();
                const photoFile = {
                    name: `${user.name}.${fileExetension}`.toLocaleLowerCase(),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExetension}`
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                let avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);
                toast.show({
                    title: "Foto Atualizada!",
                    placement: "top",
                    bgColor: "green.500"
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setPhotoIsLoading(false);
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsLoading(true);
            const userUpdated = user;
            userUpdated.name = data.name

            // Posso enviar já o data porque o nomes dos atributos já estão condizentes com o que é necessário enviar ao back-end
            await api.put('/users', data)

            updateUserProfile(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            })
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualziar os dados. Tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil' />
            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={6} px={10} >
                    {
                        photoIsLoading ?
                            <Skeleton
                                w={PHOTO_SIZE}
                                h={PHOTO_SIZE}
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.400"
                            />
                            :
                            <UserPhoto source={
                                user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg
                            } alt="Foto do usuário" size={PHOTO_SIZE} />
                    }

                    <TouchableOpacity
                        onPress={handleUserPhotoSelect}
                    >
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar Foto
                        </Text>
                    </TouchableOpacity>

                    <Controller control={control} name="name" render={({ field: { value, onChange } }) => (
                        <Input
                            placeholder='Nome'
                            bg="gray.600"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.name?.message}
                        />
                    )} />


                    <Controller control={control} name="email" render={({ field: { value, onChange } }) => (
                        <Input
                            placeholder='E-mail'
                            bg="gray.600"
                            isDisabled
                            onChangeText={onChange}
                            value={value}
                        />
                    )} />


                    <Heading color="white" fontSize="md" mb={2} mt={12} alignSelf="flex-start" fontFamily="heading">
                        Alterar senha
                    </Heading>

                    <Controller control={control} name="old_password" render={({ field: { onChange } }) => (
                        <Input
                            bg="gray.600"
                            placeholder='Senha antiga'
                            secureTextEntry
                            onChangeText={onChange}
                        />
                    )} />

                    <Controller control={control} name="password" render={({ field: { onChange } }) => (
                        <Input
                            bg="gray.600"
                            placeholder='Nova senha'
                            secureTextEntry
                            onChangeText={onChange}
                            errorMessage={errors.password?.message}
                        />
                    )} />

                    <Controller control={control} name="confirm_password" render={({ field: { onChange } }) => (
                        <Input
                            bg="gray.600"
                            placeholder='Confirme a nova senha'
                            secureTextEntry
                            onChangeText={onChange}
                            errorMessage={errors.confirm_password?.message}

                        />
                    )} />

                    <Button title='Atualizar' mt={4} onPress={handleSubmit(handleProfileUpdate)} isLoading={isLoading} />
                </Center>



            </ScrollView>
        </VStack>
    );
}