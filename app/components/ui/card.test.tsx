import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('Card Components', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Card', () => {
    it('should render the Card container correctly', () => {
      render(<Card data-testid="card-element">Card Content</Card>);
      const card = screen.getByTestId('card-element');

      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card Content');
      expect(card).toHaveAttribute('data-slot', 'card');
      expect(card).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'rounded-xl',
        'border',
      );
    });

    it('should forward custom classNames cleanly', () => {
      render(
        <Card data-testid="card-custom" className="my-custom-card-class" />,
      );
      const card = screen.getByTestId('card-custom');
      expect(card).toHaveClass('my-custom-card-class', 'bg-card', 'rounded-xl');
    });
  });

  describe('CardHeader', () => {
    it('should render the CardHeader safely', () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>);
      const header = screen.getByTestId('card-header');

      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header content');
      expect(header).toHaveAttribute('data-slot', 'card-header');
      expect(header).toHaveClass('grid', 'gap-2', 'px-6');
    });
  });

  describe('CardTitle', () => {
    it('should render the CardTitle correctly', () => {
      render(<CardTitle data-testid="card-title">Main Title</CardTitle>);
      const title = screen.getByTestId('card-title');

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Main Title');
      expect(title).toHaveAttribute('data-slot', 'card-title');
      expect(title).toHaveClass('font-semibold', 'leading-none');
    });
  });

  describe('CardDescription', () => {
    it('should render the CardDescription correctly', () => {
      render(
        <CardDescription data-testid="card-description">
          A small sub description text
        </CardDescription>,
      );
      const desc = screen.getByTestId('card-description');

      expect(desc).toBeInTheDocument();
      expect(desc).toHaveTextContent('A small sub description text');
      expect(desc).toHaveAttribute('data-slot', 'card-description');
      expect(desc).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });

  describe('CardAction', () => {
    it('should render the CardAction layout structural component', () => {
      render(
        <CardAction data-testid="card-action">
          <button type="button">Settings</button>
        </CardAction>,
      );
      const action = screen.getByTestId('card-action');

      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute('data-slot', 'card-action');
      expect(action).toHaveClass('col-start-2', 'justify-self-end');
    });
  });

  describe('CardContent', () => {
    it('should render the CardContent wrapper', () => {
      render(
        <CardContent data-testid="card-content">Inner details</CardContent>,
      );
      const content = screen.getByTestId('card-content');

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Inner details');
      expect(content).toHaveAttribute('data-slot', 'card-content');
      expect(content).toHaveClass('px-6');
    });
  });

  describe('CardFooter', () => {
    it('should render the CardFooter visually', () => {
      render(<CardFooter data-testid="card-footer">Footer items</CardFooter>);
      const footer = screen.getByTestId('card-footer');

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer items');
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
      expect(footer).toHaveClass('flex', 'items-center', 'px-6');
    });
  });

  describe('Integration / Full Assembly', () => {
    it('should assemble a complete Card architecture safely', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardAction>
              <button type="button">Edit</button>
            </CardAction>
          </CardHeader>
          <CardContent>Body Data</CardContent>
          <CardFooter>Action Buttons</CardFooter>
        </Card>,
      );

      const cardContainer = screen.getByTestId('full-card');
      expect(cardContainer).toBeInTheDocument();
      expect(
        cardContainer.querySelector('[data-slot="card-header"]'),
      ).toBeInTheDocument();
      expect(
        cardContainer.querySelector('[data-slot="card-title"]'),
      ).toBeInTheDocument();
      expect(
        cardContainer.querySelector('[data-slot="card-description"]'),
      ).toBeInTheDocument();
      expect(
        cardContainer.querySelector('[data-slot="card-action"]'),
      ).toBeInTheDocument();
      expect(
        cardContainer.querySelector('[data-slot="card-content"]'),
      ).toBeInTheDocument();
      expect(
        cardContainer.querySelector('[data-slot="card-footer"]'),
      ).toBeInTheDocument();
    });
  });
});
