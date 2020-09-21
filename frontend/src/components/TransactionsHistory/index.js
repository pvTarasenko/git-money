import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import closeModalWindow from '../../redux/actions/modalWindow/closeModalWindowTransactionHistory';
import TransactionHistoryExpenses from '../TransactionHistoryExpenses';
import styles from './TransactionsHistory.module.scss';

const ModalWindowTransactionHistory = ({ show }) => {
  const [sum, setSum] = useState('');
  const [currentName, setCurrentname] = useState(null);
  const userId = useSelector(state => state.user._id);
  const transactions = useSelector(state => state.transactions);
  const currentIdExpense = useSelector(
    state => state.isTransactionHistoryModal.idExpense
  );
  const currentCategory = useSelector(state => {
    return state.categories.filter(category => {
      return category.id === currentIdExpense;
    })[0];
  });
  const transactionsToThisExpense = transactions.filter(transaction => {
    return transaction.to === currentIdExpense;
  });
  const dispatch = useDispatch();
  const showHideClassName = show
    ? `${styles.modal} ${styles.displayBlock}`
    : `${styles.modal} ${styles.displayNone}`;
  return (
    <div className={`${showHideClassName}`}>
      <button onClick={() => dispatch(closeModalWindow())}>x</button>
      <section className={styles.modalMain}>
        <h5 className={styles.modalHeader}>
          История ваших расходов в категории: <br />
          {currentCategory && currentCategory.name}
        </h5>
        <button
          onClick={() => {
            dispatch(closeModalWindow());
          }}
        >
          <Link to={`expense/${currentIdExpense}`}>Что тебе надо?</Link>
        </button>
        {/* {transactionsToThisExpense.length ? (
          transactionsToThisExpense.map(element => {
            return <TransactionHistoryExpenses id={element._id} />;
          })
        ) : (
          <h2>История ваших покупок в данной категории пуста</h2>
        )} */}
      </section>
    </div>
  );
};

export default ModalWindowTransactionHistory;