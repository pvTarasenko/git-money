import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import deleteTransactionStarted from '../../redux/actions/deleteTransaction/deleteTransactionStarted';
import styles from './TransactionHistoryIncomeForIncome.module.scss';

function TransactionsHistoryExpense({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user._id);
  const transactions = useSelector(state => state.transactions);
  const store = useSelector(state => state.categories);
  const transaction = transactions.filter(transaction => {
    return transaction._id === id;
  })[0];
  const [prettyTime, setPrettyTime] = useState('');
  const [nameTo, setNameTo] = useState(null);
  useEffect(() => {
    setPrettyTime(new Date(transaction.time).toLocaleString());
    setNameTo(
      store.filter(category => {
        return category.id === transaction.to;
      })[0]
    );
  }, []);

  function handleClick() {
    dispatch(
      deleteTransactionStarted(
        userId,
        transaction._id,
        transaction.from,
        transaction.to,
        transaction.amount
      )
    );
  }

  return (
    <motion.li layout style={{ listStyle: 'none' }} onClick={toggleOpen}>
      <motion.div
        layout
        className={isOpen ? styles.openedWrapper : styles.wrapper}
        whileHover={{
          scale: 1.1,
          boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }}
      >
        <p className={styles.amount}>${transaction && transaction.amount}</p>
        <p className={styles.targetCategory}>
          Потрачено в <strong>{nameTo && nameTo.name}</strong>
        </p>
        <p className={styles.time}>{prettyTime && prettyTime}</p>
        {/*<h2 style={{ margin: '20px' }}> From {nameFrom && nameFrom.name} </h2>*/}
        {/*<h2 style={{ margin: '20px' }}>At time: {prettyTime && prettyTime}</h2>*/}
        <AnimatePresence>
          {isOpen && (
            <motion.p
              transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.additionalContent}
            >
              <button className={styles.deleteButton} onClick={handleClick}>
                Удалить
              </button>
              {/*TODO*/}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  );
}

export default TransactionsHistoryExpense;