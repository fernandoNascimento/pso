import React, { Component } from "react";
import "./Pso.css";
import Dot from "./Dot";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

export default class Pso extends Component {
  state = {
    particles: [],
    target: {
      x: 600,
      y: 265,
    },
    pBest: [],
    gBest: "",
    c1: 0,
    c2: 0,
  };

  //atualiza os valores das variaveis de acordo com a entrada no formulário
  onChange = (e) => {
    if (e.target.name === "particles") {
      let newParticles = [];
      for (var i = 0; i < e.target.value; i++) {
        let _x = this.getRandomInt(5, 1400);
        let _y = this.getRandomInt(5, 550);
        newParticles.push({
          x: _x,
          y: _y,
          fitness: 0,
          number: i,
        });
      }
      this.setState({ particles: newParticles, pBest: [], gBest: "" });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  //retorna um numero inteiro entre min e max definido
  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //1º - Calcular a função fitness para cada partícula ou indivíduo.
  calcFitness = () => {
    let { target, particles } = this.state;
    let newParticles = [];

    for (var i = 0; i < particles.length; i++) {
      let xParticle = particles[i].x;
      let yParticle = particles[i].y;
      let xTarget = target.x;
      let yTarget = target.y;
      let fitness = Math.sqrt(
        (xTarget - xParticle) * (xTarget - xParticle) +
          (yTarget - yParticle) * (yTarget - yParticle)
      );
      particles[i].fitness = fitness;
      newParticles.push(particles[i]);
    }
    this.setState({ particles: newParticles });
    return newParticles;
  };

  //2º - Encontrar o pbest melhor posição dentre todas já encontradas pelo indivíduo.
  calcpBest = () => {
    let { particles, pBest } = this.state;
    let newpBest = [];
    if (pBest.length <= 0) {
      newpBest = particles;
    } else {
      newpBest = pBest;
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].fitness <= newpBest[i].fitness) {
          newpBest[i] = particles[i];
        }
      }
    }
    this.setState({ pBest: newpBest });
    return newpBest;
  };

  //3º - Encontrar o gbest melhor posição dentre todas já encontradas pelo grupo.
  calcgBest = () => {
    let newgBest;
    let { gBest, particles } = this.state;
    if (gBest === "") {
      newgBest = particles[0];
    } else {
      newgBest = gBest;
    }
    particles.map((particle) => {
      if (particle.fitness <= newgBest.fitness) {
        newgBest = particle;
      }
    });
    this.setState({ gBest: newgBest });
    return newgBest;
  };

  //retorna um numero entre min e max definido
  returnRamdom = (max, min) => {
    return Math.random() * (max - min) + min;
  };

  //4º - Atualizar a velocidade de cada partícula utilizando as duas equações apresentadas anteriormente.
  updatesSpeedAndPosition = (particles, pBest, gBest) => {
    let { c1, c2 } = this.state;
    let _v1 = this.returnRamdom(0, 1) * c1;
    let _v2 = this.returnRamdom(0, 1) * c2;

    let newParticles = [];

    for (var i = 0; i < particles.length; i++) {
      let x =
        (pBest[i].x - particles[i].x) * _v1 + (gBest.x - particles[i].x) * _v2;
      let y =
        (pBest[i].y - particles[i].y) * _v1 + (gBest.y - particles[i].y) * _v2;
      particles[i].x = particles[i].x + x;
      particles[i].y = particles[i].y + y;
      newParticles.push(particles[i]);
    }

    this.setState({ particles: newParticles });
  };

  //executa as funões para executar calculo
  calc = () => {
    let particles = this.calcFitness();
    let pBest = this.calcpBest();
    let gBest = this.calcgBest();
    this.updatesSpeedAndPosition(particles, pBest, gBest);
  };

  render() {
    let { target, particles } = this.state;
    return (
      <body>
        <Box ml={50}>
          <form>
            <TextField
              id="filled-basic"
              label="Constant 1"
              variant="filled"
              name="c1"
              onChange={this.onChange}
            />
            <TextField
              id="filled-basic"
              label="Constant 2"
              variant="filled"
              name="c2"
              onChange={this.onChange}
            />
            <TextField
              id="filled-basic"
              label="Partículas"
              variant="filled"
              name="particles"
              onChange={this.onChange}
            />
            <div>
              <Box ml={25}>
                <ButtonGroup
                  color="primary"
                  aria-label="outlined primary button group"
                >
                  <Button onClick={this.calc}>Calcular</Button>
                </ButtonGroup>
              </Box>
            </div>
          </form>
        </Box>

        {target.x !== 0 ? (
          <Dot
            position={{
              marginTop: target.y,
              marginLeft: target.x,
              background: "aqua",
            }}
            number="99"
          />
        ) : (
          ""
        )}

        {particles.map((particle) => {
          return (
            <Dot
              position={{
                marginTop: particle.y,
                marginLeft: particle.x,
                background: "#feca37",
              }}
              number={particle.number}
              key={particle.number}
            />
          );
        })}
      </body>
    );
  }
}
