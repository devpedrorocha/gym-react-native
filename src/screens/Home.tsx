import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HStack, VStack, FlatList, Heading, Text, useToast } from 'native-base'

import { api } from '@services/api';
import { ExerciseDTO } from '@dtos/ExerciseDTO';

import { ExerciseCard } from '@components/ExercicseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';



export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState<string[]>([])
    const [groupSelected, setGroupSelected] = useState('antebraço')

    const [exercises, setExercises] = useState<ExerciseDTO[]>([])

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const toast = useToast();

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate('exercise', { exerciseId })
    }

    async function fetchGroups() {
        try {
            const response = await api.get('/groups');
            setGroups(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true);

            const response = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercises(response.data);


        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);

        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]));

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={String(groupSelected).toLocaleUpperCase() === String(item).toLocaleUpperCase()}
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ pr: 8, pl: 2 }}
                my={10}
                maxH={10}
                minH={10}
            />
            {
                isLoading ? <Loading /> :
                    <VStack flex={1} pl={4} pr={8} >
                        <HStack justifyContent="space-between" mb={5}>
                            <Heading color="gray.200" fontSize="md" fontFamily="heading">
                                Exercícios
                            </Heading>
                            <Text color="gray.200" fontSize="sm">
                                4
                            </Text>
                        </HStack>

                        <FlatList
                            data={exercises}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <ExerciseCard
                                    onPress={() => {
                                        handleOpenExerciseDetails(item.id)
                                    }}
                                    data={item}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            _contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </VStack>
            }
        </VStack>
    );
}