// BillSplitterScreen.jsx
import BottomNavigation from '@/components/BottomNavigation';
import TopNavigation from '@/components/TopNavigations';
import { useAuth } from '@/context/AuthContext'; // You'll need to create/import your auth context
import { getHouseBills } from '@/data/houses'; // Adjust the import based on your project structure
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Sample user data
const INITIAL_USERS = [
    { id: '1', name: 'Alex', color: '#E9D8FD', paid: 0, owes: 0 },
    { id: '2', name: 'Morgan', color: '#FED7D7', paid: 0, owes: 0 },
    { id: '3', name: 'Taylor', color: '#FEEBC8', paid: 0, owes: 0 },
    { id: '4', name: 'Jordan', color: '#C6F6D5', paid: 0, owes: 0 },
];


// Currency formatter
const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
};

// Avatar component for users
const UserAvatar = ({ user, size = 'md', isSelected, onPress }) => {
    const sizeClass = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-10 h-10 text-sm';
    const borderClass = isSelected ? 'border-2 border-blue-500' : '';

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`rounded-full items-center justify-center ${sizeClass} ${borderClass}`}
            style={{ backgroundColor: user.color }}
        >
            <Text className="font-semibold">{user.name.charAt(0)}</Text>
        </TouchableOpacity>
    );
};

// Component for expense item
const ExpenseItem = ({ expense, users, onPress }) => {
    const paidByUser = users.find(user => user.id === expense.paidBy) || users[0]; // Default to first user if not found
    const formattedDate = new Date(expense.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const splitCount = expense.splitWith ? expense.splitWith.length : users.length;

    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-100"
            onPress={onPress}
        >
            <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-lg">{expense.description}</Text>
                <Text className="font-bold text-lg">{formatCurrency(expense.price)}</Text>
            </View>

            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <UserAvatar user={paidByUser} size="sm" />
                    <Text className="ml-2 text-gray-600">
                        Paid by {paidByUser.name}
                    </Text>
                </View>
                <Text className="text-gray-500 text-sm">{formattedDate}</Text>
            </View>

            <View className="mt-2 pt-2 border-t border-gray-100">
                <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-gray-500">
                        {expense.splitType === 'custom'
                            ? 'Split custom amounts'
                            : `Split equally between ${splitCount} people`}
                    </Text>
                    <View className="flex-row">
                        {users.slice(0, 3).map(user => (
                            <View
                                key={user.id}
                                className="ml-1"
                                style={{ marginLeft: -4 }}
                            >
                                <UserAvatar user={user} size="sm" />
                            </View>
                        ))}
                        {users.length > 3 && (
                            <View className="ml-1 w-6 h-6 rounded-full bg-gray-200 items-center justify-center">
                                <Text className="text-xs text-gray-600">+{users.length - 3}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// New expense modal
const NewExpenseModal = ({ visible, onClose, onSave, users }) => {
    const [expense, setExpense] = useState({
        description: '',
        price: '',
        paidBy: users[0].id,
        due_date: new Date().toISOString(),
        splitType: 'equal',
        splitWith: users.map(user => user.id),
        customSplits: {}
    });

    const [customAmounts, setCustomAmounts] = useState({});
    const [remainingAmount, setRemainingAmount] = useState(0);

    useEffect(() => {
        if (expense.splitType === 'custom' && expense.price) {
            const totalCustom = Object.values(customAmounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
            setRemainingAmount(parseFloat(expense.price) - totalCustom);
        }
    }, [customAmounts, expense.price, expense.splitType]);

    const handleToggleUser = (userId) => {
        const isSelected = expense.splitWith.includes(userId);
        let newSplitWith;

        if (isSelected) {
            newSplitWith = expense.splitWith.filter(id => id !== userId);
            // Remove from custom splits if exists
            const newCustomSplits = { ...customAmounts };
            delete newCustomSplits[userId];
            setCustomAmounts(newCustomSplits);
        } else {
            newSplitWith = [...expense.splitWith, userId];
        }

        setExpense({ ...expense, splitWith: newSplitWith });
    };

    const handleSave = () => {
        // Validate price
        if (!expense.description || !expense.price || parseFloat(expense.price) <= 0) {
            alert('Please enter a valid description and amount');
            return;
        }

        // Finalize custom splits if using custom split
        let finalExpense = { ...expense, price: parseFloat(expense.price) };
        if (expense.splitType === 'custom') {
            finalExpense.customSplits = { ...customAmounts };

            // Check if all split amounts match total
            const totalSplit = Object.values(customAmounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
            if (Math.abs(totalSplit - parseFloat(expense.price)) > 0.01) {
                alert('Custom split amounts must add up to the total amount');
                return;
            }
        }

        onSave(finalExpense);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setExpense({
            description: '',
            price: '',
            paidBy: users[0].id,
            due_date: new Date().toISOString(),
            splitType: 'equal',
            splitWith: users.map(user => user.id),
            customSplits: {}
        });
        setCustomAmounts({});
    };

    const updateCustomAmount = (userId, amount) => {
        const newAmounts = { ...customAmounts, [userId]: amount };
        setCustomAmounts(newAmounts);
    };

    const handleSplitTypeChange = () => {
        setExpense({
            ...expense,
            splitType: expense.splitType === 'equal' ? 'custom' : 'equal'
        });

        // Reset custom amounts when switching to equal
        if (expense.splitType === 'custom') {
            setCustomAmounts({});
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View className="flex-1 justify-end bg-black bg-opacity-50">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="bg-white rounded-t-xl w-full"
                    keyboardVerticalOffset={100}
                >
                    <ScrollView className="p-5 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold">New Expense</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text className="text-blue-500 text-lg">Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="mb-4">
                            <Text className="font-medium mb-2">Description</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3"
                                placeholder="What was this expense for?"
                                value={expense.description}
                                onChangeText={(text) => setExpense({ ...expense, description: text })}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-medium mb-2">Amount</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3"
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                value={expense.price}
                                onChangeText={(text) => setExpense({ ...expense, price: text })}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-medium mb-2">Paid by</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                                <View className="flex-row">
                                    {users.map(user => (
                                        <TouchableOpacity
                                            key={user.id}
                                            className="mr-4 items-center"
                                            onPress={() => setExpense({ ...expense, paidBy: user.id })}
                                        >
                                            <UserAvatar
                                                user={user}
                                                isSelected={expense.paidBy === user.id}
                                            />
                                            <Text className="mt-1 text-sm">{user.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        <View className="mb-4">
                            <Text className="font-medium mb-2">Split with</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                                <View className="flex-row">
                                    {users.map(user => (
                                        <TouchableOpacity
                                            key={user.id}
                                            className="mr-4 items-center"
                                            onPress={() => handleToggleUser(user.id)}
                                        >
                                            <UserAvatar
                                                user={user}
                                                isSelected={expense.splitWith.includes(user.id)}
                                            />
                                            <Text className="mt-1 text-sm">{user.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        <View className="mb-6 flex-row justify-between items-center">
                            <Text className="font-medium">Split equally</Text>
                            <Switch
                                value={expense.splitType === 'equal'}
                                onValueChange={handleSplitTypeChange}
                                trackColor={{ false: '#767577', true: '#bfdbfe' }}
                                thumbColor={expense.splitType === 'equal' ? '#3b82f6' : '#f4f3f4'}
                            />
                        </View>

                        {expense.splitType === 'custom' && expense.price && (
                            <View className="mb-4">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="font-medium">Custom Split</Text>
                                    <Text className={`${remainingAmount < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                        {remainingAmount > 0 ? `${formatCurrency(remainingAmount)} left` :
                                            remainingAmount < 0 ? `${formatCurrency(Math.abs(remainingAmount))} over` :
                                                'Perfect split!'}
                                    </Text>
                                </View>

                                {expense.splitWith.map(userId => {
                                    const user = users.find(u => u.id === userId);
                                    return (
                                        <View key={userId} className="flex-row items-center justify-between mb-3">
                                            <View className="flex-row items-center">
                                                <UserAvatar user={user} size="sm" />
                                                <Text className="ml-2">{user.name}</Text>
                                            </View>
                                            <TextInput
                                                className="border border-gray-300 rounded-lg p-2 w-24 text-right"
                                                placeholder="0.00"
                                                keyboardType="decimal-pad"
                                                value={customAmounts[userId] || ''}
                                                onChangeText={(text) => updateCustomAmount(userId, text)}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        <TouchableOpacity
                            className="bg-blue-500 py-3 rounded-lg items-center mt-4 mb-6"
                            onPress={handleSave}
                        >
                            <Text className="text-white font-semibold text-lg">Save Expense</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

// Settlement view
const SettlementView = ({ users, settlements }) => {
    if (settlements.length === 0) {
        return (
            <View className="bg-white p-4 rounded-lg items-center justify-center">
                <Text className="text-gray-500">Everyone is settled up!</Text>
            </View>
        );
    }

    return (
        <View>
            {settlements.map((settlement, index) => {
                const fromUser = users.find(u => u.id === settlement.from);
                const toUser = users.find(u => u.id === settlement.to);

                return (
                    <View
                        key={index}
                        className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-100"
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <UserAvatar user={fromUser} size="sm" />
                                <Text className="mx-2">→</Text>
                                <UserAvatar user={toUser} size="sm" />
                            </View>
                            <Text className="font-bold">{formatCurrency(settlement.amount)}</Text>
                        </View>
                        <Text className="text-gray-600 mt-1">
                            {fromUser.name} owes {toUser.name}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

// Summary card for each user
const UserSummaryCard = ({ user, totalPaid, totalOwes, netBalance }) => {
    const isPositive = netBalance >= 0;

    return (
        <View className="bg-white p-3 rounded-lg mr-3 shadow-sm border border-gray-100 w-36">
            <View className="flex-row items-center mb-2">
                <UserAvatar user={user} size="sm" />
                <Text className="ml-2 font-semibold">{user.name}</Text>
            </View>

            <Text className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{formatCurrency(netBalance)}
            </Text>

            <View className="mt-2">
                <Text className="text-xs text-gray-500">
                    Paid: {formatCurrency(totalPaid)}
                </Text>
                <Text className="text-xs text-gray-500">
                    Owes: {formatCurrency(totalOwes)}
                </Text>
            </View>
        </View>
    );
};

// Main Bill Splitter component
const BillSplitterScreen = () => {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newExpenseModalVisible, setNewExpenseModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'settle'
    const [activeTab2, setActiveTab2] = useState('bills');
    const [userSummaries, setUserSummaries] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const { id } = useLocalSearchParams();
    const { token } = useAuth(); // Assuming you have an AuthContext that provides the token

    const handleTabChange = (route) => {
        router.push(`/management/${id}/${route}`);
    };

    // Fetch bills data from API
    useEffect(() => {
        const fetchBills = async () => {
            try {
                setIsLoading(true);
                const billsData = await getHouseBills(id, token);

                // Transform API data to match our expense structure
                const transformedExpenses = billsData.data.map(bill => ({
                    id: bill.id,
                    description: bill.description,
                    price: bill.price,
                    due_date: bill.due_date,
                    paidBy: users[0].id, // Default to first user since API doesn't specify
                    splitType: 'equal',
                    splitWith: users.map(user => user.id) // Default to all users
                }));

                setExpenses(transformedExpenses);
            } catch (error) {
                console.error("Error fetching bills:", error);
                alert("Failed to load bills. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id && token) {
            fetchBills();
        }
    }, [id, token]);

    useEffect(() => {
        if (!isLoading) {
            calculateBalances();
        }
    }, [expenses, isLoading]);

    const calculateBalances = () => {
        // Reset all user balances
        const updatedUsers = users.map(user => ({
            ...user,
            paid: 0,
            owes: 0
        }));

        // Calculate what each user paid and owes
        expenses.forEach(expense => {
            const paidBy = expense.paidBy;
            const paidAmount = parseFloat(expense.price);
            const splitWith = expense.splitWith || users.map(user => user.id);

            // Add to paid amount
            const paidByUser = updatedUsers.find(u => u.id === paidBy);
            if (paidByUser) {
                paidByUser.paid += paidAmount;
            }

            // Calculate what each person owes
            if (!expense.splitType || expense.splitType === 'equal') {
                const splitAmount = paidAmount / splitWith.length;
                splitWith.forEach(userId => {
                    const user = updatedUsers.find(u => u.id === userId);
                    if (user) {
                        // If you paid, you owe yourself (net zero)
                        // Otherwise you owe the split amount
                        if (userId !== paidBy) {
                            user.owes += splitAmount;
                        }
                    }
                });
            } else {
                // Handle custom splits
                Object.entries(expense.customSplits || {}).forEach(([userId, amount]) => {
                    const user = updatedUsers.find(u => u.id === userId);
                    if (user && userId !== paidBy) {
                        user.owes += parseFloat(amount);
                    }
                });
            }
        });

        // Calculate net balance for each user
        const summaries = updatedUsers.map(user => {
            const netBalance = user.paid - user.owes;
            return {
                ...user,
                netBalance
            };
        });

        setUserSummaries(summaries);
        setUsers(updatedUsers);

        // Calculate settlements
        calculateSettlements(summaries);
    };

    const calculateSettlements = (summaries) => {
        const debtors = summaries.filter(u => u.netBalance < 0)
            .sort((a, b) => a.netBalance - b.netBalance);
        const creditors = summaries.filter(u => u.netBalance > 0)
            .sort((a, b) => b.netBalance - a.netBalance);

        const settlements = [];

        while (debtors.length > 0 && creditors.length > 0) {
            const debtor = debtors[0];
            const creditor = creditors[0];

            const debtAmount = Math.abs(debtor.netBalance);
            const creditAmount = creditor.netBalance;

            const settlementAmount = Math.min(debtAmount, creditAmount);

            if (settlementAmount > 0.01) { // Avoid tiny amounts due to floating point
                settlements.push({
                    from: debtor.id,
                    to: creditor.id,
                    amount: Number(settlementAmount.toFixed(2))
                });
            }

            // Update balances
            debtor.netBalance += settlementAmount;
            creditor.netBalance -= settlementAmount;

            // Remove settled users
            if (Math.abs(debtor.netBalance) < 0.01) debtors.shift();
            if (Math.abs(creditor.netBalance) < 0.01) creditors.shift();
        }

        setSettlements(settlements);
    };

    const addNewExpense = async (expense) => {
        try {
            // Here you would typically call your API to create a new bill
            // const response = await API.post(`/houses/${id}/bills`, expense, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });

            // For now, just add it to the local state
            const newExpense = {
                ...expense,
                id: `temp-${Date.now()}`, // Temporary ID until we get one from the API
            };

            setExpenses([...expenses, newExpense]);
        } catch (error) {
            console.error("Error adding new expense:", error);
            alert("Failed to add expense. Please try again.");
        }
    };

    return (
        <View className="flex-1">
            <TopNavigation activeTab={activeTab2} onTabChange={route => handleTabChange(route)} />
            <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
                <Text className="text-2xl font-bold mb-4">Split Bills</Text>

                {/* User summaries */}
                {!isLoading && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                        {userSummaries.map(user => (
                            <UserSummaryCard
                                key={user.id}
                                user={user}
                                totalPaid={user.paid}
                                totalOwes={user.owes}
                                netBalance={user.netBalance}
                            />
                        ))}
                    </ScrollView>
                )}

                {/* Tab navigation */}
                <View className="flex-row border-b border-gray-200">
                    <TouchableOpacity
                        className={`py-2 px-4 ${activeTab === 'expenses' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => setActiveTab('expenses')}
                    >
                        <Text
                            className={`font-medium ${activeTab === 'expenses' ? 'text-blue-500' : 'text-gray-600'}`}
                        >
                            Expenses
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`py-2 px-4 ${activeTab === 'settle' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => setActiveTab('settle')}
                    >
                        <Text
                            className={`font-medium ${activeTab === 'settle' ? 'text-blue-500' : 'text-gray-600'}`}
                        >
                            Settle Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-4">
                {isLoading ? (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="mt-4 text-gray-600">Loading expenses...</Text>
                    </View>
                ) : activeTab === 'expenses' ? (
                    expenses.length > 0 ? (
                        expenses.map(expense => (
                            <ExpenseItem
                                key={expense.id}
                                expense={expense}
                                users={users}
                                onPress={() => { /* Handle expense selection */ }}
                            />
                        ))
                    ) : (
                        <View className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500">No expenses found. Add one!</Text>
                        </View>
                    )
                ) : (
                    <SettlementView
                        users={users}
                        settlements={settlements}
                    />
                )}
            </ScrollView>

            {/* FAB for adding new expense */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-blue-500 rounded-full w-14 h-14 items-center justify-center shadow-lg"
                onPress={() => setNewExpenseModalVisible(true)}
            >
                <Text className="text-white text-3xl font-light">+</Text>
            </TouchableOpacity>

            {/* New expense modal */}
            <NewExpenseModal
                visible={newExpenseModalVisible}
                onClose={() => setNewExpenseModalVisible(false)}
                onSave={addNewExpense}
                users={users}
            />
            <BottomNavigation />
        </View>
    );
};

export default BillSplitterScreen;