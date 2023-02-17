import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, Heading, ScrollView, Skeleton, Text, VStack } from 'native-base'

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UsePhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const PHOTO_SIZE = 33;

export function Profile() {

    const [photoIsLoading, setPhotoIsLoading] = useState(false)

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
                            <UserPhoto source={{ uri: 'https://github.com/devpedrorocha.png' }} alt="Foto do usuário" size={PHOTO_SIZE} />
                    }

                    <TouchableOpacity>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar Foto
                        </Text>
                    </TouchableOpacity>

                    <Input
                        placeholder='Nome'
                        bg="gray.600"
                    />

                    <Input
                        placeholder='E-mail'
                        bg="gray.600"
                        isDisabled
                    />


                    <Heading color="white" fontSize="md" mb={2} mt={12} alignSelf="flex-start">
                        Alterar senha
                    </Heading>
                    <Input
                        bg="gray.600"
                        placeholder='Senha antiga'
                        secureTextEntry
                    />
                    <Input
                        bg="gray.600"
                        placeholder='Nova senha'
                    />

                    <Input
                        bg="gray.600"
                        placeholder='Confirme a nova senha'
                        secureTextEntry
                    />

                    <Button title='Atualizar' mt={4} />
                </Center>



            </ScrollView>
        </VStack>
    );
}