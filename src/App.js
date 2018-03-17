import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    accountName: 'dante_de_braso',
    accountId: '',
    allBattles: '',
    avgDamage: '',
    sessionBattles: '',
    sessionDmg: '',
    nextAvgDmg: ''
  };

  componentDidMount() {
    fetch('https://api.worldoftanks.ru/wot/account/list/?application_id=demo&search=' + this.state.accountName)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            accountIdLoaded: true,
            accountId: result.data[0].account_id
          });
          fetch('https://api.worldoftanks.ru/wot/account/info/?application_id=demo&account_id=' + this.state.accountId)
            .then(res => res.json())
            .then(
              (result) => {
                this.setState({
                  allBattles: result.data[this.state.accountId].statistics.all.battles,
                  avgDamage: result.data[this.state.accountId].statistics.all.damage_dealt
                })
              }
            )
        }
      )
  }

  calcDmg = () => {
    this.setState({
      nextAvgDmg: ((this.state.allBattles * this.state.avgDamage) + (this.state.sessionBattles * this.state.sessionDmg)) / (this.state.allBattles + this.state.sessionBattles)
    })
  }

  handleChange = (e) => {
    const name = e.target.attributes.name.nodeValue
    const value = e.target.value;
    this.setState({
      [name]: value
    })
  }


  render() {

    return (

      <div className="App">

        Идентификатор аккаунта: {this.state.accountId}

        <br />

        Количество боёв: {this.state.allBattles}

        <br />

        средний урон: {this.state.avgDamage / this.state.allBattles}

        <br />

        <input type="text" placeholder='количество боёв за сессию' onChange={this.handleChange} name='sessionBattles' />
        <br />
        <input type="text" placeholder='количество урона за сессию' onChange={this.handleChange} name='sessionDmg' />
        <br />

        <button onClick={this.calcDmg}>Рассчитать</button>

        <br />

        {this.state.nextAvgDmg}

      </div>
    );
  }
}

export default App;