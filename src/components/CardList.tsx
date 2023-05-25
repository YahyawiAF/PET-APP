import { FC } from "react";
import styled from "styled-components";
import { Col } from "react-bootstrap";
import { CardCat } from "./Card";

type Props = {
  pets: any[];
  onLoadMore: () => void;
  canLoadMore: boolean;
};

const LoadMoreButton = styled.button`
  margin: 10px auto;
  display: block;
`;

export const CardList: FC<Props> = ({ pets, onLoadMore, canLoadMore }) => {
  return (
    <main role="main">
      <div className="py-5">
          <div className="row">
            {pets.map((pet) => (
              <Col key={pet.id} md={4} lg={3} xl={3}>
                <CardCat key={pet.id} pet={pet} img={pet.url} id={pet.id} />
              </Col>
            ))}
            {canLoadMore && (
              <LoadMoreButton onClick={onLoadMore}>Load more</LoadMoreButton>
            )}
          </div>
      </div>
    </main>
  );
};