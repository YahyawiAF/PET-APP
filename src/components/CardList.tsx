import { FC } from "react";
import styled from "styled-components";
import { Col } from "react-bootstrap";
import { CardCat } from "./Card";
import { useTranslation } from "react-i18next";

type Props = {
  pets: any[];
  onLoadMore: () => void;
  canLoadMore: boolean;
  // handleDelete: (id: string) => Promise<void>;
};

const LoadMoreButton = styled.button`
  margin: 10px auto;
  display: block;
`;

export const CardList: FC<Props> = ({
  pets,
  onLoadMore,
  canLoadMore,
  // handleDelete,
}) => {
  const { t } = useTranslation();

  return (
    <main role="main">
      <div className="py-5">
        <div className="row">
          {pets.map((pet) => (
            <Col key={pet.id} sm={7} md={5} lg={4} xl={3}>
              <CardCat
                key={pet.id}
                pet={pet}
                img={pet.url}
                id={pet.id}
                // handleDelete={handleDelete}
              />
            </Col>
          ))}
          {canLoadMore && (
            <LoadMoreButton onClick={onLoadMore}>
              {t("loadMore")}
            </LoadMoreButton>
          )}
        </div>
      </div>
    </main>
  );
};
