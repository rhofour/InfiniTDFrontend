import Konva from 'konva';

export interface LayerRenderer<State, Config> {
  init(config: Config, stage: Konva.Stage): Promise<void>;
  render(state: State, cellSize: number): void;
}
