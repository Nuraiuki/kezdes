import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(12, 59, 46, 0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 1.5rem 1rem 1.2rem 1rem;
  max-width: 320px;
  width: 96vw;
  min-width: 0;
  position: relative;
  text-align: center;
  @media (max-width: 480px) {
    padding: 1.1rem 0.5rem 0.7rem 0.5rem;
    max-width: 98vw;
  }
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #bbb;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #0C3B2E; }
`;
const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? theme.green : '#888')};
  border-bottom: 2.5px solid ${({ $active, theme }) => ($active ? theme.green : 'transparent')};
  padding-bottom: 6px;
  cursor: pointer;
  transition: color 0.2s, border 0.2s;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;
const Input = styled.input`
  padding: 0.9rem 1rem;
  border-radius: 0.8rem;
  border: 1.5px solid #e0e0e0;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.green};
  }
`;
const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  padding: 0.95rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
  width: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow};
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.8rem 0;
  }
`;
const ErrorMsg = styled.div`
  color: #d32f2f;
  font-size: 0.98rem;
  margin-top: -0.7rem;
`;
const TestBlock = styled.div`
  background: #f9faf9;
  border-radius: 1rem;
  padding: 1.1rem 0.7rem 0.7rem 0.7rem;
  margin-bottom: 0.5rem;
  font-size: 0.98rem;
`;
const TestQ = styled.div`
  margin-bottom: 0.7rem;
  font-weight: 500;
`;
const TestOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-start;
`;
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.97rem;
  cursor: pointer;
`;

const questions = [
  {
    q: "Вам больше нравятся проводить время в больших компаниях или в узком кругу друзей?",
    a: "A. в больших",
    b: "Б. в узком кругу друзей"
  },
  {
    q: "Оказавшись на новом мероприятии, что делаете в первые 10 минут?",
    a: "A. Сразу начинаю общаться, знакомлюсь, инициирую разговоры.",
    b: "Б. Сначала наблюдаю и прислушиваюсь; вступаю в беседу, только если почувствую комфорт."
  },
  {
    q: "Три часа активного общения позади. Ваше состояние?",
    a: "A. Чувствую подъём энергии и готов ещё продолжать.",
    b: "Б. Устал — нужно побыть одному, чтобы восстановиться."
  }
];

export default function AuthModal({ open, onClose, onAuth }) {
  const [tab, setTab] = useState("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "register" && name.trim().length < 2) {
        setError("Введите имя (минимум 2 буквы)"); setLoading(false); return;
      }
      if (!login.match(/^\S+@\S+\.\S+$/)) {
        setError("Введите корректный email"); setLoading(false); return;
      }
      if (password.length < 5) {
        setError("Пароль должен быть не менее 5 символов"); setLoading(false); return;
      }
      if (tab === "register" && answers.some(a => a !== "A" && a !== "Б")) {
        setError("Ответьте на все вопросы теста"); setLoading(false); return;
      }
      if (tab === "register") {
        const res = await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: login,
            name,
            password,
            answers
          })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || "Ошибка регистрации");
        }
        const user = await res.json();
        onAuth && onAuth(user);
        onClose();
        setAnswers(["", "", ""]);
        setLoading(false);
        return;
      }
      if (tab === "login") {
        const res = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: login,
            password
          })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || "Ошибка входа");
        }
        const user = await res.json();
        onAuth && onAuth(user);
        onClose();
        setLoading(false);
        return;
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleRadio = (idx, val) => {
    setAnswers(ans => ans.map((a, i) => (i === idx ? val : a)));
  };

  return (
    <Overlay>
      <Modal>
        <CloseBtn onClick={onClose} title="Закрыть">×</CloseBtn>
        <Tabs>
          <Tab $active={tab === "login"} onClick={() => { setTab("login"); setError(""); }}>Вход</Tab>
          <Tab $active={tab === "register"} onClick={() => { setTab("register"); setError(""); }}>Регистрация</Tab>
        </Tabs>
        <Form onSubmit={handleSubmit}>
          {tab === "register" && (
            <>
              <Input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                required
              />
              {questions.map((q, idx) => (
                <TestBlock key={idx}>
                  <TestQ>{q.q}</TestQ>
                  <TestOptions>
                    <RadioLabel>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value="A"
                        checked={answers[idx] === "A"}
                        onChange={() => handleRadio(idx, "A")}
                        required
                      />
                      {q.a}
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value="Б"
                        checked={answers[idx] === "Б"}
                        onChange={() => handleRadio(idx, "Б")}
                        required
                      />
                      {q.b}
                    </RadioLabel>
                  </TestOptions>
                </TestBlock>
              ))}
            </>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <SubmitBtn type="submit">{tab === "login" ? "Войти" : "Зарегистрироваться"}</SubmitBtn>
        </Form>
      </Modal>
    </Overlay>
  );
} 