import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import openModalWindow from '../../redux/actions/modalWindow/openModalWindowAddMoney.js';
import openModalWindowTransactionHistoryExpenses from '../../redux/actions/modalWindow/openModalWindowTransactionHistory';
import styles from './category.module.scss';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import expenses from '../../img/expenses';
import incomes from '../../img/incomes';

const Category = ({ value, id, iconId }) => {
  const history = useHistory();
  const userId = useSelector(state => state.user._id);
  const dispatch = useDispatch();
  const category = useSelector(state =>
    state.categories.filter(category => category.id === id)
  )[0];
  return (
    <motion.div
      className={styles.card}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
    >
      <div
        className={styles.image}
        onClick={
          value === 'store'
            ? () => dispatch(openModalWindow(id))
            : () => {
                dispatch(openModalWindowTransactionHistoryExpenses(id));
                history.push(`/expense/${id}`);
              }
        }
      >
        {value === 'store' ? incomes[iconId] : expenses[iconId]}
      </div>
      <p className={styles.categorySubheader} style={{ fontWeight: '700' }}>
        {category.name}
      </p>
      <p className={styles.categorySum}>₽ {category.currentNumber}</p>
      {category.limit < category.currentNumber && 'Превышен лимит'}
    </motion.div>
  );
};

export default Category;
