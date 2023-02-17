import { ExerciseCard } from '@components/ExercicseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { HStack, VStack, FlatList, Heading, Text } from 'native-base'
import { useState } from 'react';


export function Home() {

    const [groups, setGroups] = useState(['Costas', 'Ombro', 'Bíceps', 'Tríceps'])
    const [groupSelected, setGroupSelected] = useState('Costas')

    const [exercises, setExercises] = useState(['Puxada Frontal', 'Remada curvada', 'Remada unilateral', 'Levantmento Terra'])

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise')
    }

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
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            onPress={handleOpenExerciseDetails}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20 }}
                />
            </VStack>

        </VStack>
    );
}