import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  client,
  GET_TODOS,
  ADD_TODO,
  DELETE_TODO,
  UPDATE_TODO,
} from "../lib/graphql";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function TodoScreen() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<
    { id: string; text: string; done?: boolean }[]
  >([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const loadTodos = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) return;
      setUserId(storedUserId);

      try {
        const res = await client.request(GET_TODOS, { userId: storedUserId });
        const withDoneFlag = res.todos.map((todo: any) => ({
          ...todo,
          done: false,
        }));
        setTodos(withDoneFlag);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    };

    loadTodos();
  }, []);

  const submitTodo = async () => {
    if (!input.trim() || !userId) return;

    try {
      if (isEditing && editingId) {
        const res = await client.request(UPDATE_TODO, {
          id: editingId,
          text: input,
        });
        setTodos((prev) =>
          prev.map((todo) => (todo.id === editingId ? res.updateTodo : todo)),
        );
        setIsEditing(false);
        setEditingId(null);
      } else {
        const res = await client.request(ADD_TODO, { userId, text: input });
        setTodos([...todos, { ...res.addTodo, done: false }]);
      }

      setInput("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await client.request(DELETE_TODO, { id });
      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (isEditing && editingId === id) {
        setIsEditing(false);
        setEditingId(null);
        setInput("");
      }
    } catch (err: any) {
      Alert.alert("Delete failed", err.message);
    }
  };

  const toggleDone = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Tasks</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={styles.listContainer}
          data={todos}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setInput(item.text);
                setEditingId(item.id);
                setIsEditing(true);
              }}
              style={styles.taskBox}
            >
              <TouchableOpacity onPress={() => toggleDone(item.id)}>
                <Ionicons
                  name={item.done ? "checkbox" : "square-outline"}
                  size={24}
                  color={item.done ? "#909090" : "#ccc"}
                />
              </TouchableOpacity>
              <Text style={[styles.todoItem, item.done && styles.todoItemDone]}>
                {item.text}
              </Text>
              <TouchableOpacity
                onPress={() => deleteTodo(item.id)}
                style={styles.menuButton}
              >
                <Ionicons name="trash" size={20} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet</Text>
          }
        />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Insert task..."
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TouchableOpacity onPress={submitTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>{isEditing ? "✓" : "+"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 32,
  },
  logoutButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 12,
  },
  taskBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  todoItem: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  todoItemDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  menuButton: {
    padding: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: "#181818",
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
  },
});
